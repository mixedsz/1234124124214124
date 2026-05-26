import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, unknown> = {};

  // Test 1: bulk list with gameName
  try {
    const r = await fetch(
      'https://servers-frontend.fivem.net/api/servers/?gameName=gta5',
      { signal: AbortSignal.timeout(8000) },
    );
    const text = await r.text();
    results['bulk_gameNameGta5'] = {
      status: r.status,
      contentType: r.headers.get('content-type'),
      byteLength: text.length,
      preview: text.slice(0, 400),
    };
  } catch (e) { results['bulk_gameNameGta5'] = { error: String(e) }; }

  // Test 2: bulk list no params
  try {
    const r = await fetch(
      'https://servers-frontend.fivem.net/api/servers/',
      { signal: AbortSignal.timeout(8000) },
    );
    const text = await r.text();
    results['bulk_noParams'] = {
      status: r.status,
      contentType: r.headers.get('content-type'),
      byteLength: text.length,
      preview: text.slice(0, 400),
    };
  } catch (e) { results['bulk_noParams'] = { error: String(e) }; }

  // Test 3: single server (District 10) — known to work
  try {
    const r = await fetch(
      'https://servers-frontend.fivem.net/api/servers/single/l7o9o4',
      { signal: AbortSignal.timeout(5000) },
    );
    const j = await r.json();
    results['single_l7o9o4'] = {
      status: r.status,
      clients: j?.Data?.clients,
      hasResources: Array.isArray(j?.Data?.resources),
      resourceCount: j?.Data?.resources?.length,
      sampleResources: (j?.Data?.resources ?? []).slice(0, 10),
      iconVersion: j?.Data?.iconVersion,
    };
  } catch (e) { results['single_l7o9o4'] = { error: String(e) }; }

  return NextResponse.json(results, { headers: { 'Cache-Control': 'no-store' } });
}
