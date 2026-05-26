import { NextResponse } from 'next/server';

export const revalidate = 300;

// Hardcoded featured servers — edit this list to add/remove servers
const FEATURED_SERVER_IDS = [
  'l7o9o4',  // District 10
  'ql64g9',
  'javxzp',
  'yjbqg5',
  '7b9kqrb',
];

function stripColors(str: string): string {
  return str.replace(/\^[0-9]/g, '').replace(/[^\x20-\x7E]/g, '').trim();
}

interface CfxData {
  hostname?: string;
  projectName?: string;
  clients?: number;
  sv_maxclients?: number;
  iconVersion?: number;
}

interface ServerEntry {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  icon: string | null;
}

function makeEntry(id: string, data: CfxData): ServerEntry {
  const iv = data.iconVersion;
  return {
    id,
    name: stripColors(data.projectName || data.hostname || 'Unknown'),
    players:    data.clients       ?? 0,
    maxPlayers: data.sv_maxclients ?? 0,
    icon: iv != null ? `https://frontend.cfx-services.net/api/servers/icon/${id}/${iv}.png` : null,
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
  const results = await Promise.allSettled(FEATURED_SERVER_IDS.map(fetchSingle));

  const servers: ServerEntry[] = [];
  results.forEach((result, i) => {
    if (result.status === 'fulfilled' && result.value) {
      servers.push(makeEntry(FEATURED_SERVER_IDS[i], result.value));
    }
  });

  return NextResponse.json(servers, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
