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

// Fetch a list of top server IDs (sorted by players) from CFX.re.
// Tries multiple endpoint variations to handle unknown response shape.
async function fetchTopServerIds(limit: number): Promise<string[]> {
  const urls = [
    `https://servers-frontend.fivem.net/api/servers/?gameName=gta5`,
    `https://servers-frontend.fivem.net/api/servers/`,
  ];

  for (const url of urls) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!r.ok) continue;
      const raw = await r.json();

      // Extract [id, clientCount] pairs from whatever shape comes back
      const pairs: [string, number][] = [];

      // Shape A: { servers: [[id, {Data}], ...] }
      if (Array.isArray(raw?.servers)) {
        for (const item of raw.servers) {
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
      // Shape C: { [id]: { Data, EndPoint } } — skip "servers"/"total" keys
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
    } catch { /* try next url */ }
  }
  return [];
}

export async function GET() {
  // 1. Always fetch the pinned server directly
  const pinnedData = await fetchSingle(PINNED_SERVER_ID);
  const pinned = pinnedData ? makeEntry(PINNED_SERVER_ID, pinnedData) : null;

  // 2. Get top 100 server IDs from the bulk list
  const topIds = await fetchTopServerIds(100);

  // 3. Fetch each individual server to get its resources[]
  //    (single endpoint is the only reliable source of resources)
  const toCheck = topIds.filter(id => id !== PINNED_SERVER_ID);
  const checks = await Promise.allSettled(toCheck.map(fetchSingle));

  const flakeServers: ServerEntry[] = [];
  checks.forEach((result, i) => {
    if (result.status !== 'fulfilled' || !result.value) return;
    const data = result.value;
    const resources: string[] = data.resources ?? [];
    if (resources.some(isFlakeResource)) {
      flakeServers.push(makeEntry(toCheck[i], data));
    }
  });

  flakeServers.sort((a, b) => b.players - a.players);

  const result: ServerEntry[] = [];
  if (pinned) result.push(pinned);
  result.push(...flakeServers.slice(0, 3));

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
