import { NextResponse } from 'next/server';
import { readRegistry } from '@/lib/metrics';

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

export async function GET() {
  // 1. Always fetch the pinned server first
  const pinnedData = await fetchSingle(PINNED_SERVER_ID);
  const pinned = pinnedData ? makeEntry(PINNED_SERVER_ID, pinnedData) : null;

  // 2. Read from metrics registry (servers that have phoned home)
  const registry = await readRegistry();
  const now = Date.now();
  const maxAge = 7 * 24 * 60 * 60 * 1000;

  const flakeServers: ServerEntry[] = [];

  // Servers with a cfx.re ID — fetch live data
  const withCfxId = Object.values(registry).filter(s =>
    now - s.lastSeen < maxAge &&
    s.cfxId &&
    s.cfxId !== PINNED_SERVER_ID &&
    s.resources.some(isFlakeResource),
  );

  if (withCfxId.length > 0) {
    const liveData = await Promise.allSettled(
      withCfxId.map(s => fetchSingle(s.cfxId!)),
    );
    liveData.forEach((result, i) => {
      const server = withCfxId[i];
      if (result.status === 'fulfilled' && result.value) {
        flakeServers.push(makeEntry(server.cfxId!, result.value));
      } else {
        flakeServers.push({
          id: server.cfxId!,
          name: server.name,
          players: server.players,
          maxPlayers: server.maxPlayers,
          icon: null,
          url: `https://5metrics.dev/server/${server.cfxId}`,
        });
      }
    });
  }

  // Servers without a cfx.re ID — use cached ping data
  const withoutCfxId = Object.values(registry).filter(s =>
    now - s.lastSeen < maxAge &&
    !s.cfxId &&
    s.cfxId !== PINNED_SERVER_ID &&
    s.resources.some(isFlakeResource),
  );
  for (const server of withoutCfxId.slice(0, 3)) {
    flakeServers.push({
      id: server.id,
      name: server.name,
      players: server.players,
      maxPlayers: server.maxPlayers,
      icon: null,
      url: '#',
    });
  }

  flakeServers.sort((a, b) => b.players - a.players);

  const result: ServerEntry[] = [];
  if (pinned) result.push(pinned);
  result.push(...flakeServers.slice(0, 3));

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
