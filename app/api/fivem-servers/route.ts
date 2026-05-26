import { NextResponse } from 'next/server';

export const revalidate = 300;

// District 10 is always shown first — pinned by the store owner
const PINNED_SERVER_ID = 'l7o9o4';

// All Flake Development resource names (used to detect servers running our scripts)
const FLAKE_RESOURCES = new Set([
  'flake_loading', 'flake-blackmarkets', 'flake_drugselling',
  'flake_bodybag', 'flake-plugs', 'flake_wanted', 'flake-aiems', 'flake_shops',
  'flake_loading_screen', 'flake_drugs', 'flake_blackmarket',
]);

function isFlakeResource(name: string): boolean {
  return FLAKE_RESOURCES.has(name) || name.startsWith('flake_') || name.startsWith('flake-');
}

function stripColorCodes(str: string): string {
  return str.replace(/\^[0-9]/g, '').replace(/[^\x20-\x7E]/g, '').trim();
}

interface ServerData {
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

async function fetchServerList(): Promise<Map<string, ServerData>> {
  // CFX.re server list API — returns dict of { serverId: { EndPoint, Data } }
  const res = await fetch(
    'https://servers-frontend.fivem.net/api/servers/?gameName=gta5',
    { signal: AbortSignal.timeout(12000) },
  );
  if (!res.ok) return new Map();

  const raw = await res.json();

  const map = new Map<string, ServerData>();

  // Format 1: object keyed by server ID
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    for (const [id, entry] of Object.entries(raw as Record<string, { Data?: ServerData }>)) {
      if (entry?.Data) map.set(id, entry.Data);
    }
    return map;
  }

  // Format 2: { servers: [[id, entry], ...] }
  if (Array.isArray(raw?.servers)) {
    for (const [id, entry] of raw.servers as [string, { Data?: ServerData }][]) {
      if (entry?.Data) map.set(id, entry.Data);
    }
  }

  return map;
}

async function fetchSingleServer(id: string): Promise<ServerData | null> {
  try {
    const res = await fetch(
      `https://servers-frontend.fivem.net/api/servers/single/${id}`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.Data ?? null;
  } catch {
    return null;
  }
}

function buildEntry(id: string, data: ServerData, pinned = false): ServerEntry {
  const iconVersion = data.iconVersion;
  return {
    id,
    name: stripColorCodes(data.projectName || data.hostname || 'Unknown'),
    players:    data.clients        ?? 0,
    maxPlayers: data.sv_maxclients  ?? 0,
    icon: iconVersion != null
      ? `https://frontend.cfx-services.net/api/servers/icon/${id}/${iconVersion}.png`
      : null,
    url: `https://5metrics.dev/server/${id}`,
  };
}

export async function GET() {
  try {
    // 1. Fetch the full server list
    const allServers = await fetchServerList();

    // 2. Separate pinned server from the rest
    let pinnedEntry: ServerEntry | null = null;
    const pinnedData = allServers.get(PINNED_SERVER_ID);
    if (pinnedData) {
      pinnedEntry = buildEntry(PINNED_SERVER_ID, pinnedData, true);
    } else {
      // Pinned server not in bulk list — fetch individually
      const single = await fetchSingleServer(PINNED_SERVER_ID);
      if (single) pinnedEntry = buildEntry(PINNED_SERVER_ID, single, true);
    }

    // 3. Find top servers running Flake resources (excluding pinned)
    const flakeServers: ServerEntry[] = [];
    for (const [id, data] of allServers.entries()) {
      if (id === PINNED_SERVER_ID) continue;
      const resources: string[] = data.resources ?? [];
      if (resources.some(isFlakeResource)) {
        flakeServers.push(buildEntry(id, data));
      }
    }

    // 4. Sort by player count, take top 3 to fill alongside pinned
    flakeServers.sort((a, b) => b.players - a.players);
    const topOthers = flakeServers.slice(0, 3);

    // 5. Build final list: pinned first, then top others
    const result: ServerEntry[] = [];
    if (pinnedEntry) result.push(pinnedEntry);
    result.push(...topOthers);

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch {
    // Always try to return at least the pinned server
    const single = await fetchSingleServer(PINNED_SERVER_ID).catch(() => null);
    if (single) {
      return NextResponse.json([buildEntry(PINNED_SERVER_ID, single)], {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
      });
    }
    return NextResponse.json([], {
      headers: { 'Cache-Control': 'public, s-maxage=60' },
    });
  }
}
