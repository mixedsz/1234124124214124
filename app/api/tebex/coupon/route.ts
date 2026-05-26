import { NextRequest, NextResponse } from 'next/server';

const TEBEX_API_BASE = 'https://headless.tebex.io/api';
const PUBLIC_TOKEN = process.env.NEXT_PUBLIC_TEBEX_PUBLIC_TOKEN;

export async function POST(request: NextRequest) {
  const { ident, code, type } = await request.json();

  if (!ident || !code) {
    return NextResponse.json({ error: 'Basket ident and code are required' }, { status: 400 });
  }

  if (!PUBLIC_TOKEN) {
    return NextResponse.json({ error: 'Store not configured' }, { status: 500 });
  }

  try {
    let endpoint: string;
    let body: Record<string, string>;

    if (type === 'creator_code') {
      endpoint = `${TEBEX_API_BASE}/accounts/${PUBLIC_TOKEN}/baskets/${ident}/creator-codes`;
      body = { creator_code: code };
    } else {
      endpoint = `${TEBEX_API_BASE}/accounts/${PUBLIC_TOKEN}/baskets/${ident}/coupons`;
      body = { coupon_code: code };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      let message = 'Invalid code';
      try {
        const json = JSON.parse(text);
        message = json.message || json.error || message;
      } catch {
        // ignore parse error
      }
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, basket: data.data || data });
  } catch (error) {
    console.error('[Tebex Coupon API] Error:', error);
    return NextResponse.json({ error: 'Failed to apply code' }, { status: 500 });
  }
}
