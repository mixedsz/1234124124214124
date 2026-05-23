import { NextRequest, NextResponse } from 'next/server';

const TEBEX_API_BASE = 'https://headless.tebex.io/api';
const PUBLIC_TOKEN = process.env.NEXT_PUBLIC_TEBEX_PUBLIC_TOKEN;
const PRIVATE_KEY = process.env.TEBEX_PRIVATE_KEY;

export async function POST(request: NextRequest) {
  const { basketIdent, returnUrl } = await request.json();

  if (!PRIVATE_KEY) {
    console.error('[Tebex Auth] Private key not configured');
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
    // Use the accounts endpoint with private key header
    const authUrl = `${TEBEX_API_BASE}/accounts/${PUBLIC_TOKEN}/baskets/${basketIdent}/auth?returnUrl=${encodeURIComponent(returnUrl)}`;
    
    console.log('[Tebex Auth] Requesting:', authUrl);
    
    const response = await fetch(authUrl, {
      method: 'GET',
      headers: {
        'X-Tebex-Secret': PRIVATE_KEY,
      },
    });

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
    console.log('[Tebex Auth] Response data:', JSON.stringify(data));
    
    // The auth endpoint returns an array of auth providers like:
    // [{ "name": "FiveM", "url": "https://..." }]
    // Or data.data if wrapped
    let authProviders = data;
    if (data.data && Array.isArray(data.data)) {
      authProviders = data.data;
    }
    
    // Find the FiveM provider or use the first one
    let selectedUrl: string | null = null;
    
    if (Array.isArray(authProviders)) {
      const fivemProvider = authProviders.find((p: { name: string; url: string }) => 
        p.name?.toLowerCase().includes('fivem') || p.name?.toLowerCase().includes('cfx')
      );
      
      if (fivemProvider && fivemProvider.url) {
        selectedUrl = fivemProvider.url;
      } else if (authProviders.length > 0 && authProviders[0].url) {
        selectedUrl = authProviders[0].url;
      }
    } else if (typeof authProviders === 'object' && authProviders.url) {
      selectedUrl = authProviders.url;
    }
    
    console.log('[Tebex Auth] Selected URL:', selectedUrl);
    
    return NextResponse.json({ url: selectedUrl });
  } catch (error) {
    console.error('[Tebex Auth API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get auth URL' },
      { status: 500 }
    );
  }
}
