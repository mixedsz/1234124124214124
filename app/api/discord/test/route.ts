import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    DISCORD_CLIENT_ID: !!process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: !!process.env.DISCORD_CLIENT_SECRET,
    DISCORD_CLIENT_ID_length: process.env.DISCORD_CLIENT_ID?.length ?? 0,
    discord_keys_in_env: Object.keys(process.env).filter(k => k.startsWith('DISCORD')),
    NODE_ENV: process.env.NODE_ENV,
  });
}
