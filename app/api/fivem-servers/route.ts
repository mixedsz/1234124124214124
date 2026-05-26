import { NextResponse } from 'next/server';

export const revalidate = 300;

const PINNED_SERVER_ID = 'l7o9o4'; // District 10 — always first

const FLAKE_RESOURCES = new Set([
  'flake_loading', 'flake-blackmarkets', 'flake_drugselling',
  'flake_bodybag', 'flake-plugs', 'flake_wanted', 'flake-aiems', 'flake_shops',
]);

function isFlakeResource(name: string): boolean {
  return (
    FLAKE_RESOURCES.has(name) ||
    name.startsWith('flake_') ||
    name.startsWith('flake-')
  );
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

async function fetchSingle(id: string): Promise<CfxData | null> {
  try {
    const r = await fetch(
      `https://servers-frontend.fivem.net/api/servers/single/${id}`,
      { signal: AbortSignal.timeout(6000) },
    );
    if (!r.ok) return null;
    const j = await r.json();
    return j?.Data ?? null;
  } catch { return null; }
}

// Returns a map of serverId → CfxData from the bulk server list.
// Resources may or may not be populated depending on what CFX includes.
async function fetchBulkList(): Promise<Map<string, CfxData>> {
  const map = new Map<string, CfxData>();
  try {
    const r = await fetch(
      'https://servers-frontend.fivem.net/api/servers/?gameName=gta5',
      { signal: AbortSignal.timeout(15000) },
    );
    if (!r.ok) return map;
    const raw = await r.json();

    // Possible shapes:
    // A: { servers: [[id, {Data, EndPoint}], ...], total: N }
    // B: { [id]: {Data, EndPoint} }
    // C: [[id, {Data, EndPoint}], ...]

    const entries: [string, { Data?: CfxData }][] = [];

    if (Array.isArray(raw?.servers)) {
      // Shape A
      for (const item of raw.servers) {
        if (Array.isArray(item) && item.length >= 2) entries.push(item as [string, { Data?: CfxData }]);
      }
    } else if (Array.isArray(raw)) {
      // Shape C
      for (const item of raw) {
        if (Array.isArray(item) && item.length >= 2) entries.push(item as [string, { Data?: CfxData }]);
      }
    } else if (raw && typeof raw === 'object') {
      // Shape B — only if keys look like server IDs (not "servers"/"total")
      for (const [k, v] of Object.entries(raw as Record<string, { Data?: CfxData }>)) {
        if (k !== 'servers' && k !== 'total' && v?.Data) entries.push([k, v]);
      }
    }

    for (const [id, entry] of entries) {
      if (entry?.Data) map.set(id, entry.Data);
    }
  } catch { /* return empty map */ }
  return map;
}

// Check the top-N busy servers individually when bulk list lacks resources.
async function findFlakeServersViaIndividualFetch(
  bulkMap: Map<string, CfxData>,
  limit = 40,
): Promise<ServerEntry[]> {
  // Sort by player count and take top N server IDs (excluding pinned)
  const topIds = [...bulkMap.entries()]
    .filter(([id]) => id !== PINNED_SERVER_ID)
    .sort((a, b) => (b[1].clients ?? 0) - (a[1].clients ?? 0))
    .slice(0, limit)
    .map(([id]) => id);

  const results = await Promise.allSettled(topIds.map(fetchSingle));
  const flake: ServerEntry[] = [];

  results.forEach((r, i) => {
    if (r.status !== 'fulfilled' || !r.value) return;
    const data = r.value;
    const resources: string[] = data.resources ?? [];
    if (resources.some(isFlakeResource)) {
      flake.push(makeEntry(topIds[i], data));
    }
  });

  return flake.sort((a, b) => b.players - a.players);
}

export async function GET() {
  // 1. Always fetch District 10 (pinned)
  const pinnedData = await fetchSingle(PINNED_SERVER_ID);
  const pinned = pinnedData ? makeEntry(PINNED_SERVER_ID, pinnedData) : null;

  // 2. Fetch bulk list
  const bulkMap = await fetchBulkList();

  let otherFlake: ServerEntry[] = [];

  if (bulkMap.size > 0) {
    // Check if bulk list includes resources
    const sampleHasResources = [...bulkMap.values()]
      .slice(0, 20)
      .some(d => Array.isArray(d.resources) && d.resources.length > 0);

    if (sampleHasResources) {
      // Resources are in bulk — filter directly
      for (const [id, data] of bulkMap) {
        if (id === PINNED_SERVER_ID) continue;
        if ((data.resources ?? []).some(isFlakeResource)) {
          otherFlake.push(makeEntry(id, data));
        }
      }
      otherFlake.sort((a, b) => b.players - a.players);
    } else {
      // Resources NOT in bulk — check top servers individually
      otherFlake = await findFlakeServersViaIndividualFetch(bulkMap);
    }
  }

  const result: ServerEntry[] = [];
  if (pinned) result.push(pinned);
  result.push(...otherFlake.filter(s => s.id !== PINNED_SERVER_ID).slice(0, 3));

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
