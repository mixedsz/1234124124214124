import { NextResponse } from 'next/server';

export const revalidate = 60;

export async function GET() {
  const secret = process.env.TEBEX_SECRET_KEY;
  if (!secret) return NextResponse.json([]);

  try {
    const res = await fetch('https://plugin.tebex.io/payments', {
      headers: { 'X-Tebex-Secret': secret },
      next: { revalidate: 60 },
    });

    if (!res.ok) return NextResponse.json([]);

    const raw = await res.json();
    const payments: Array<{ player?: { name?: string }; packages?: Array<{ name?: string }> }> = Array.isArray(raw) ? raw : (raw.data ?? []);

    const seen = new Set<string>();
    const buyers = payments
      .filter(p => {
        const name = p.player?.name;
        if (!name || seen.has(name)) return false;
        seen.add(name);
        return true;
      })
      .slice(0, 20)
      .map(p => ({ username: p.player!.name!, packageName: p.packages?.[0]?.name ?? '' }));

    return NextResponse.json(buyers);
  } catch {
    return NextResponse.json([]);
  }
}
