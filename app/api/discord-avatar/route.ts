import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const DEFAULT_AVATAR = 'https://cdn.discordapp.com/embed/avatars/0.png';

function defaultAvatarForId(id: string) {
  try {
    const index = Number(BigInt(id) >> BigInt(22)) % 6;
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  } catch {
    return DEFAULT_AVATAR;
  }
}

async function avatarFromUserId(id: string, token: string): Promise<string | null> {
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

async function avatarFromUsername(username: string, token: string, guildId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/members/search?query=${encodeURIComponent(username)}&limit=5`,
      { headers: { Authorization: `Bot ${token}` }, next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const members: Array<{ user?: { id: string; avatar?: string; username: string } }> = await res.json();
    // Find closest match (exact username or starts-with)
    const lower = username.toLowerCase();
    const match = members.find(m => m.user?.username.toLowerCase() === lower)
      ?? members.find(m => m.user?.username.toLowerCase().startsWith(lower))
      ?? members[0];
    if (!match?.user) return null;
    const user = match.user;
    if (!user.avatar) return null;
    const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=128`;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const username = req.nextUrl.searchParams.get('username');
  const token = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;

  // --- Look up by Discord user ID (snowflake) ---
  if (id && /^\d{17,19}$/.test(id)) {
    if (token) {
      const url = await avatarFromUserId(id, token);
      if (url) {
        return NextResponse.redirect(url, { headers: { 'Cache-Control': 'public, max-age=3600' } });
      }
    }
    return NextResponse.redirect(defaultAvatarForId(id), {
      headers: { 'Cache-Control': 'public, max-age=3600' },
    });
  }

  // --- Look up by username via guild member search ---
  if (username && token && guildId) {
    const url = await avatarFromUsername(username, token, guildId);
    if (url) {
      return NextResponse.redirect(url, { headers: { 'Cache-Control': 'public, max-age=3600' } });
    }
  }

  return NextResponse.redirect(DEFAULT_AVATAR, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  });
}
