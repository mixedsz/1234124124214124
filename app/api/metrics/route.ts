import { NextRequest, NextResponse } from 'next/server';
import { readRegistry, writeRegistry } from '@/lib/metrics';

export const dynamic = 'force-dynamic';

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function GET(req: NextRequest) {
  const resourceName = req.nextUrl.searchParams.get('resourceName');
  const registry = await readRegistry();
  const now = Date.now();

  const active = Object.values(registry).filter(s => now - s.lastSeen < MAX_AGE_MS);

  if (resourceName) {
    const servers = active.filter(s =>
      s.resources.some(r => r === resourceName || r.startsWith(resourceName)),
    );
    return NextResponse.json({ servers, count: servers.length, resource: resourceName });
  }

  return NextResponse.json({ servers: active, count: active.length });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.name || typeof body.name !== 'string') {
    return NextResponse.json({ error: 'name required' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const raw = `${ip}::${body.name}`;
  const fingerprint = raw.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 48);

  const cfxId =
    typeof body.cfxId === 'string' && /^[a-zA-Z0-9]{4,8}$/.test(body.cfxId)
      ? body.cfxId
      : undefined;

  const registry = await readRegistry();

  registry[fingerprint] = {
    id: fingerprint,
    cfxId,
    name: String(body.name).slice(0, 100),
    players: Math.max(0, Number(body.players) || 0),
    maxPlayers: Math.max(0, Number(body.maxPlayers) || 128),
    resources: Array.isArray(body.resources)
      ? (body.resources as string[]).filter(r => typeof r === 'string').slice(0, 200)
      : [],
    lastSeen: Date.now(),
  };

  await writeRegistry(registry);

  return NextResponse.json({ ok: true });
}
