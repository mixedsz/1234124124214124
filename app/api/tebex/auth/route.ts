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
    console.log('[Tebex Auth] Full response:', JSON.stringify(data, null, 2));
    
    // The auth endpoint returns an array of auth providers like:
    // [{ "name": "FiveM", "url": "https://..." }]
    // Could be data directly as array, or wrapped in data.data
    let authProviders: Array<{ name: string; url: string }> = [];
    
    if (Array.isArray(data)) {
      authProviders = data;
    } else if (data && Array.isArray(data.data)) {
      authProviders = data.data;
    } else if (data && typeof data === 'object') {
      // Maybe it's a single object with url
      if (data.url) {
        console.log('[Tebex Auth] Direct URL found:', data.url);
        return NextResponse.json({ url: data.url });
      }
    }
    
    console.log('[Tebex Auth] Auth providers found:', authProviders.length);
    
    // Find the FiveM/CFX provider or use the first one
    let selectedUrl: string | null = null;
    
    if (authProviders.length > 0) {
      // Look for FiveM specifically
      const fivemProvider = authProviders.find((p) => 
        p.name?.toLowerCase().includes('fivem') || 
        p.name?.toLowerCase().includes('cfx') ||
        p.name?.toLowerCase().includes('citizenfx')
      );
      
      if (fivemProvider && fivemProvider.url) {
        selectedUrl = fivemProvider.url;
        console.log('[Tebex Auth] Found FiveM provider:', fivemProvider.name);
      } else if (authProviders[0]?.url) {
        // Use first available provider
        selectedUrl = authProviders[0].url;
        console.log('[Tebex Auth] Using first provider:', authProviders[0].name);
      }
    }
    
    console.log('[Tebex Auth] Selected URL:', selectedUrl ? 'Found' : 'Not found');
    
    if (!selectedUrl) {
      console.error('[Tebex Auth] No auth URL found in response');
      return NextResponse.json(
        { error: 'No authentication provider found', providers: authProviders },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ url: selectedUrl });
  } catch (error) {
    console.error('[Tebex Auth API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get auth URL' },
      { status: 500 }
    );
  }
}
