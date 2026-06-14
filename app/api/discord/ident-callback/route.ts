import { NextRequest, NextResponse } from 'next/server';

const TEBEX_API_BASE = 'https://headless.tebex.io/api';
const PUBLIC_TOKEN = process.env.NEXT_PUBLIC_TEBEX_PUBLIC_TOKEN;
const PRIVATE_KEY = process.env.TEBEX_PRIVATE_KEY;

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const basketIdent = searchParams.get('basketIdent');
  const returnTo = searchParams.get('returnTo') || '/store';

  // Log ALL params Tebex may have appended to this return URL
  const allParams: Record<string, string> = {};
  searchParams.forEach((v, k) => { allParams[k] = v; });
  console.log('[DiscordIdentCallback] Received params from Tebex ident:', JSON.stringify(allParams));

  // Check if Tebex appended a discord_id directly to the return URL
  const tebexDiscordId = searchParams.get('discord_id') || searchParams.get('discordId');

  let discordId: string | null = tebexDiscordId;

  if (!discordId && basketIdent && (PUBLIC_TOKEN || PRIVATE_KEY)) {
    try {
      // Try private key first (more fields exposed)
      const headers: Record<string, string> = {};
      if (PRIVATE_KEY) headers['X-Tebex-Secret'] = PRIVATE_KEY;

      const token = PUBLIC_TOKEN;
      const url = `${TEBEX_API_BASE}/accounts/${token}/baskets/${basketIdent}`;
      console.log('[DiscordIdentCallback] Querying basket:', url);

      const res = await fetch(url, { headers, cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const basket = data.data ?? data;

        // Log ALL basket keys so we can see what Tebex adds after Discord auth
        console.log('[DiscordIdentCallback] Basket keys after Discord auth:', Object.keys(basket));
        console.log('[DiscordIdentCallback] Full basket:', JSON.stringify(basket, null, 2));

        // Try every plausible field name Tebex might use for discord_id
        discordId =
          basket.discord_id ??
          basket.discordId ??
          basket.discord_user_id ??
          basket.social_discord_id ??
          basket.auth?.discord_id ??
          null;

        if (discordId) {
          console.log('[DiscordIdentCallback] Found discord_id in basket:', discordId);
        } else {
          console.log('[DiscordIdentCallback] discord_id not found in basket. Check full basket log above.');
        }
      } else {
        console.error('[DiscordIdentCallback] Basket query failed:', res.status);
      }
    } catch (err) {
      console.error('[DiscordIdentCallback] Error querying basket:', err);
    }
  }

  const returnUrl = new URL(returnTo, origin);
  returnUrl.searchParams.set('discord_linked', '1');
  if (discordId) returnUrl.searchParams.set('discord_id', String(discordId));

  return NextResponse.redirect(returnUrl.toString());
}
