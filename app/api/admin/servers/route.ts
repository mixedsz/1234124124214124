import { NextRequest, NextResponse } from 'next/server';
import { getServerIds, addServerId, removeServerId } from '@/lib/server-list';

export const dynamic = 'force-dynamic';

function authorized(req: NextRequest): boolean {
  const key = process.env.BLOB_WEBHOOK_PUBLIC_KEY;
  return !!key && req.headers.get('authorization') === `Bearer ${key}`;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const ids = await getServerIds();
  return NextResponse.json({ ids });
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { id?: string; action?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const id = body.id?.trim();
  if (!id || !/^[a-zA-Z0-9]{4,8}$/.test(id)) {
    return NextResponse.json({ error: 'Invalid server ID' }, { status: 400 });
  }

  if (body.action === 'remove') {
    const result = await removeServerId(id);
    return NextResponse.json({ ok: true, ...result });
  }

  const result = await addServerId(id);
  return NextResponse.json({ ok: true, ...result });
}
