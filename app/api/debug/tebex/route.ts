/**
 * Debug endpoint — returns the raw Tebex API response for diagnosing
 * "One of the options provided is invalid" and similar errors.
 *
 * Usage (from browser or curl):
 *   POST /api/debug/tebex
 *   Header: x-debug-key: YOUR_DEBUG_KEY  (set DEBUG_KEY env var on Vercel)
 *   Body: { "action": "addPackage", "ident": "...", "packageId": 123 }
 *   Body: { "action": "getPackage", "packageId": 123 }
 *   Body: { "action": "getBasket", "ident": "..." }
 */
import { NextRequest, NextResponse } from 'next/server';

const TEBEX_API_BASE = 'https://headless.tebex.io/api';
const PUBLIC_TOKEN = process.env.NEXT_PUBLIC_TEBEX_PUBLIC_TOKEN;
const DEBUG_KEY = process.env.DEBUG_KEY;

export async function POST(request: NextRequest) {
  // Require a debug key so random people can't probe your basket IDs
  const key = request.headers.get('x-debug-key');
  if (DEBUG_KEY && key !== DEBUG_KEY) {
    return NextResponse.json({ error: 'Unauthorized — set x-debug-key header' }, { status: 401 });
  }

  const { action, ident, packageId, variableData } = await request.json();

  if (action === 'getPackage') {
    const url = `${TEBEX_API_BASE}/accounts/${PUBLIC_TOKEN}/packages/${packageId}`;
    const res = await fetch(url, { cache: 'no-store' });
    const body = await res.text();
    let parsed: unknown = body;
    try { parsed = JSON.parse(body); } catch { /* keep as string */ }
    return NextResponse.json({ status: res.status, url, body: parsed });
  }

  if (action === 'getBasket') {
    const url = `${TEBEX_API_BASE}/accounts/${PUBLIC_TOKEN}/baskets/${ident}`;
    const res = await fetch(url, { cache: 'no-store' });
    const body = await res.text();
    let parsed: unknown = body;
    try { parsed = JSON.parse(body); } catch { /* keep as string */ }
    return NextResponse.json({ status: res.status, url, body: parsed });
  }

  if (action === 'addPackage') {
    const reqBody: Record<string, unknown> = { package_id: packageId, quantity: 1 };
    if (variableData) reqBody.variable_data = variableData;

    const url = `${TEBEX_API_BASE}/baskets/${ident}/packages`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    });
    const responseText = await res.text();
    let parsed: unknown = responseText;
    try { parsed = JSON.parse(responseText); } catch { /* keep as string */ }

    return NextResponse.json({
      status: res.status,
      ok: res.ok,
      url,
      requestBody: reqBody,
      responseBody: parsed,
    });
  }

  return NextResponse.json({ error: 'Unknown action. Use: getPackage | getBasket | addPackage' }, { status: 400 });
}
