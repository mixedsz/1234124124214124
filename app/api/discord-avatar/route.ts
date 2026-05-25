import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

async function resolveAvatarUrl(id: string): Promise<string | null> {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(`https://discord.com/api/v10/users/${id}`, {
      headers: { Authorization: `Bot ${token}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const user = await res.json();
    if (!user.avatar) return null;
    const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${id}/${user.avatar}.${ext}?size=128`;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const json = req.nextUrl.searchParams.get('json') === '1';

  if (!id || !/^\d{17,19}$/.test(id)) {
    if (json) return NextResponse.json({ url: null });
    return NextResponse.redirect(new URL('https://cdn.discordapp.com/embed/avatars/0.png'));
  }

  const avatarUrl = await resolveAvatarUrl(id);

  if (json) {
    return NextResponse.json(
      { url: avatarUrl },
      { headers: { 'Cache-Control': 'public, max-age=3600' } },
    );
  }

  if (avatarUrl) {
    return NextResponse.redirect(avatarUrl, {
      headers: { 'Cache-Control': 'public, max-age=3600' },
    });
  }

  // Default Discord avatar (index 0-5 based on user ID)
  const index = Number(BigInt(id) >> BigInt(22)) % 6;
  return NextResponse.redirect(
    `https://cdn.discordapp.com/embed/avatars/${index}.png`,
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
