import { NextResponse } from 'next/server';

export const revalidate = 300;

const FEATURED_SERVERS = [
  { id: 'l7o9o4', displayName: 'District 10',  url: 'https://5metrics.dev/server/l7o9o4' },
  // Add more FiveM server IDs here (find them at cfx.re or 5metrics.dev)
];

function stripColorCodes(str: string): string {
  return str.replace(/\^[0-9]/g, '').replace(/[^\x20-\x7E]/g, '').trim();
}

async function fetchServer(id: string, displayName: string, url: string) {
  try {
    const res = await fetch(
      `https://servers-frontend.fivem.net/api/servers/single/${id}`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.Data ?? json;
    return {
      id,
      name: displayName || stripColorCodes(data?.projectName || data?.hostname || 'Unknown'),
      players:    data?.clients        ?? 0,
      maxPlayers: data?.sv_maxclients  ?? 0,
      icon:       data?.icon ? `data:image/png;base64,${data.icon}` : null,
      url,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const results = await Promise.allSettled(
    FEATURED_SERVERS.map(s => fetchServer(s.id, s.displayName, s.url)),
  );

  const servers = results
    .filter((r): r is PromiseFulfilledResult<NonNullable<Awaited<ReturnType<typeof fetchServer>>>> =>
      r.status === 'fulfilled' && r.value !== null,
    )
    .map(r => r.value);

  return NextResponse.json(servers, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
