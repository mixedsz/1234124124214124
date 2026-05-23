import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: 'Discord not configured. Set DISCORD_CLIENT_ID env var.' }, { status: 500 });
  }

  const returnTo = request.nextUrl.searchParams.get('returnTo') || '/store';
  const redirectUri = `${request.nextUrl.origin}/api/discord/callback`;

  const state = Buffer.from(JSON.stringify({ returnTo })).toString('base64url');

  const url = new URL('https://discord.com/oauth2/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'identify');
  url.searchParams.set('state', state);

  return NextResponse.redirect(url.toString());
}
