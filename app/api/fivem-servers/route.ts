import { NextResponse } from 'next/server';

export const revalidate = 300;

const PINNED_SERVER_ID = 'l7o9o4'; // District 10 — always first

function isFlakeResource(name: string): boolean {
  return name.startsWith('flake_') || name.startsWith('flake-');
}

function stripColors(str: string): string {
  return str.replace(/\^[0-9]/g, '').replace(/[^\x20-\x7E]/g, '').trim();
}

interface CfxData {
  hostname?: string;
  projectName?: string;
  clients?: number;
  sv_maxclients?: number;
  resources?: string[];
  iconVersion?: number;
}

interface ServerEntry {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  icon: string | null;
  url: string;
}

function makeEntry(id: string, data: CfxData): ServerEntry {
  const iv = data.iconVersion;
  return {
    id,
    name: stripColors(data.projectName || data.hostname || 'Unknown'),
    players:    data.clients       ?? 0,
    maxPlayers: data.sv_maxclients ?? 0,
    icon: iv != null ? `https://frontend.cfx-services.net/api/servers/icon/${id}/${iv}.png` : null,
    url: `https://5metrics.dev/server/${id}`,
  };
}

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
};

// Single-server endpoint always returns full data including resources[]
async function fetchSingle(id: string): Promise<CfxData | null> {
  try {
    const r = await fetch(
      `https://servers-frontend.fivem.net/api/servers/single/${id}`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (!r.ok) return null;
    const j = await r.json();
    return j?.Data ?? null;
  } catch { return null; }
}

// Extract cfx.re server IDs from an HTML string (6-char codes from /server/XXXXXX URLs)
function extractServerIds(html: string): string[] {
  const matches = html.matchAll(/\/server\/([a-zA-Z0-9]{4,8})/g);
  return [...new Set([...matches].map(m => m[1]))];
}

// Try fetching 5metrics.dev resource pages with browser headers to extract server IDs
async function fetchIdsFromMetrics(): Promise<string[]> {
  const resourceUrls = [
    'https://5metrics.dev/resource/flake_bodybag',
    'https://5metrics.dev/resource/flake_garage',
    'https://5metrics.dev/resource/flake_banking',
    'https://5metrics.dev/resource/flake_mdt',
  ];

  for (const url of resourceUrls) {
    try {
      const r = await fetch(url, {
        headers: BROWSER_HEADERS,
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) continue;
      const html = await r.text();
      const ids = extractServerIds(html);
      if (ids.length > 0) return ids.slice(0, 50);
    } catch { /* try next */ }
  }
  return [];
}

// Fetch a list of top server IDs from runtime.fivem.net or other working endpoints
async function fetchTopServerIds(limit: number): Promise<string[]> {
  const attempts = [
    // runtime.fivem.net variants (untested from Vercel - might work)
    { url: 'https://runtime.fivem.net/api/servers/?gameName=gta5&count=100', headers: {} },
    { url: 'https://runtime.fivem.net/api/servers/', headers: {} },
    // cfx.re direct
    { url: 'https://cfx.re/api/servers?count=100', headers: {} },
    // servers-frontend variants with browser headers
    { url: 'https://servers-frontend.fivem.net/api/servers/list?gameName=gta5', headers: BROWSER_HEADERS },
    { url: 'https://servers-frontend.fivem.net/api/servers/top?gameName=gta5', headers: BROWSER_HEADERS },
  ];

  for (const { url, headers } of attempts) {
    try {
      const r = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json', ...headers },
        signal: AbortSignal.timeout(10000),
      });
      if (!r.ok) continue;

      let raw: unknown;
      const ct = r.headers.get('content-type') ?? '';
      if (ct.includes('application/json') || ct.includes('text/json')) {
        raw = await r.json();
      } else {
        // Try to parse as JSON anyway
        const text = await r.text();
        try { raw = JSON.parse(text); } catch { continue; }
      }

      const pairs: [string, number][] = [];

      // Shape A: { servers: [[id, {Data}], ...] }
      if (Array.isArray((raw as Record<string, unknown>)?.servers)) {
        for (const item of (raw as { servers: unknown[] }).servers) {
          if (Array.isArray(item) && item.length >= 2) {
            const [id, entry] = item as [string, { Data?: CfxData }];
            pairs.push([id, entry?.Data?.clients ?? 0]);
          }
        }
      }
      // Shape B: [[id, {Data}], ...]
      else if (Array.isArray(raw)) {
        for (const item of raw) {
          if (Array.isArray(item) && item.length >= 2) {
            const [id, entry] = item as [string, { Data?: CfxData }];
            pairs.push([id, entry?.Data?.clients ?? 0]);
          }
        }
      }
      // Shape C: { [id]: { Data, EndPoint } }
      else if (raw && typeof raw === 'object') {
        for (const [k, v] of Object.entries(raw as Record<string, { Data?: CfxData }>)) {
          if (k === 'servers' || k === 'total') continue;
          pairs.push([k, v?.Data?.clients ?? 0]);
        }
      }

      if (pairs.length > 0) {
        return pairs
          .sort((a, b) => b[1] - a[1])
          .slice(0, limit)
          .map(([id]) => id);
      }
    } catch { /* try next */ }
  }
  return [];
}

export async function GET() {
  // 1. Always fetch the pinned server directly
  const pinnedData = await fetchSingle(PINNED_SERVER_ID);
  const pinned = pinnedData ? makeEntry(PINNED_SERVER_ID, pinnedData) : null;

  // 2. Try to get server IDs: first from bulk list, then from 5metrics.dev
  let topIds = await fetchTopServerIds(100);
  if (topIds.length === 0) {
    topIds = await fetchIdsFromMetrics();
  }

  const flakeServers: ServerEntry[] = [];

  if (topIds.length > 0) {
    // 3. Fetch each server individually to check resources
    const toCheck = topIds.filter(id => id !== PINNED_SERVER_ID);
    const checks = await Promise.allSettled(toCheck.map(fetchSingle));

    checks.forEach((result, i) => {
      if (result.status !== 'fulfilled' || !result.value) return;
      const data = result.value;
      const resources: string[] = data.resources ?? [];
      if (resources.some(isFlakeResource)) {
        flakeServers.push(makeEntry(toCheck[i], data));
      }
    });

    flakeServers.sort((a, b) => b.players - a.players);
  }

  const result: ServerEntry[] = [];
  if (pinned) result.push(pinned);
  result.push(...flakeServers.slice(0, 3));

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
