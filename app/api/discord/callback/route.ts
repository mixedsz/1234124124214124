import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;

  let returnTo = '/store';
  if (state) {
    try {
      const parsed = JSON.parse(Buffer.from(state, 'base64url').toString());
      returnTo = parsed.returnTo || '/store';
    } catch { /* ignore malformed state */ }
  }

  if (!code || !clientId || !clientSecret) {
    const url = new URL(returnTo, request.nextUrl.origin);
    url.searchParams.set('discord_error', '1');
    return NextResponse.redirect(url.toString());
  }

  const redirectUri = `${request.nextUrl.origin}/api/discord/callback`;

  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) throw new Error(`Token exchange failed: ${tokenRes.status}`);

    const { access_token } = await tokenRes.json();

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userRes.ok) throw new Error(`User fetch failed: ${userRes.status}`);

    const user = await userRes.json();

    const returnUrl = new URL(returnTo, request.nextUrl.origin);
    returnUrl.searchParams.set('discord_id', user.id);
    returnUrl.searchParams.set('discord_username', user.username);
    return NextResponse.redirect(returnUrl.toString());
  } catch (err) {
    console.error('[Discord OAuth] Callback error:', err);
    const errorUrl = new URL(returnTo, request.nextUrl.origin);
    errorUrl.searchParams.set('discord_error', '1');
    return NextResponse.redirect(errorUrl.toString());
  }
}
