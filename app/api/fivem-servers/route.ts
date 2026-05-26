import { NextResponse } from 'next/server';
import { getServerIds } from '@/lib/server-list';

export const revalidate = 300; // Cache at Vercel edge for 5 minutes

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
  const ids = await getServerIds();
  const results = await Promise.allSettled(ids.map(fetchSingle));

  const servers: ServerEntry[] = [];
  results.forEach((result, i) => {
    if (result.status === 'fulfilled' && result.value) {
      servers.push(makeEntry(ids[i], result.value));
    }
  });

  return NextResponse.json(servers);
}
