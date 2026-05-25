import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');

  if (!id || !/^\d{17,19}$/.test(id)) {
    return NextResponse.redirect(new URL('https://cdn.discordapp.com/embed/avatars/0.png'));
  }

  const token = process.env.DISCORD_BOT_TOKEN;

  if (token) {
    try {
      const res = await fetch(`https://discord.com/api/v10/users/${id}`, {
        headers: { Authorization: `Bot ${token}` },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const user = await res.json();
        if (user.avatar) {
          const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
          const avatarUrl = `https://cdn.discordapp.com/avatars/${id}/${user.avatar}.${ext}?size=128`;
          return NextResponse.redirect(avatarUrl, {
            headers: { 'Cache-Control': 'public, max-age=3600' },
          });
        }
      }
    } catch {
      // fall through to default
    }
  }

  // Default Discord avatar (index 0-5 based on user ID)
  const index = Number(BigInt(id) >> BigInt(22)) % 6;
  return NextResponse.redirect(
    `https://cdn.discordapp.com/embed/avatars/${index}.png`,
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
