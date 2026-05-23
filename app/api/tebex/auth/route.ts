import { NextRequest, NextResponse } from 'next/server';

const TEBEX_API_BASE = 'https://headless.tebex.io/api';
const PRIVATE_KEY = process.env.TEBEX_PRIVATE_KEY;

export async function POST(request: NextRequest) {
  const { basketIdent, returnUrl } = await request.json();

  if (!PRIVATE_KEY) {
    console.error('[Tebex] Private key not configured');
    return NextResponse.json(
      { error: 'Tebex private key not configured' },
      { status: 500 }
    );
  }

  if (!basketIdent) {
    return NextResponse.json(
      { error: 'Basket ident required' },
      { status: 400 }
    );
  }

  try {
    // Use private key endpoint
    const response = await fetch(
      `${TEBEX_API_BASE}/baskets/${basketIdent}/auth?returnUrl=${encodeURIComponent(returnUrl)}`,
      {
        method: 'GET',
        headers: {
          'X-Tebex-Secret': PRIVATE_KEY,
        },
      }
    );

    if (!response.ok) {
      console.error('[Tebex Auth API] Failed:', response.status, response.statusText);
      const text = await response.text();
      console.error('[Tebex Auth API] Response:', text);
      return NextResponse.json(
        { error: `Tebex API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ url: data.url || data.data?.url });
  } catch (error) {
    console.error('[Tebex Auth API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get auth URL' },
      { status: 500 }
    );
  }
}
