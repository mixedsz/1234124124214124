import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Upgrade-Insecure-Requests': '1',
};

interface TestResult {
  status?: number;
  contentType?: string | null;
  byteLength?: number;
  preview?: string;
  serverIdsFound?: string[];
  error?: string;
}

const CFX_TESTS = [
  { key: 'runtime_gta5_100', url: 'https://runtime.fivem.net/api/servers/?gameName=gta5&count=100', headers: {} },
  { key: 'runtime_bare', url: 'https://runtime.fivem.net/api/servers/', headers: {} },
  { key: 'cfx_api', url: 'https://cfx.re/api/servers?count=10', headers: {} },
  { key: 'frontend_list', url: 'https://servers-frontend.fivem.net/api/servers/list?gameName=gta5', headers: BROWSER_HEADERS },
  { key: 'frontend_top', url: 'https://servers-frontend.fivem.net/api/servers/top?gameName=gta5', headers: BROWSER_HEADERS },
  { key: 'single_l7o9o4', url: 'https://servers-frontend.fivem.net/api/servers/single/l7o9o4', headers: {} },
];

const METRICS_TESTS = [
  { key: 'metrics_bodybag', url: 'https://5metrics.dev/resource/flake_bodybag' },
  { key: 'metrics_garage', url: 'https://5metrics.dev/resource/flake_garage' },
];

export async function GET() {
  const results: Record<string, TestResult> = {};

  // Test CFX.re endpoints
  await Promise.allSettled(
    CFX_TESTS.map(async ({ key, url, headers }) => {
      try {
        const r = await fetch(url, {
          signal: AbortSignal.timeout(8000),
          headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json', ...headers },
        });
        const text = await r.text();
        results[key] = {
          status: r.status,
          contentType: r.headers.get('content-type'),
          byteLength: text.length,
          preview: text.slice(0, 400),
        };
      } catch (e) {
        results[key] = { error: String(e) };
      }
    }),
  );

  // Test 5metrics.dev with browser headers
  await Promise.allSettled(
    METRICS_TESTS.map(async ({ key, url }) => {
      try {
        const r = await fetch(url, {
          signal: AbortSignal.timeout(8000),
          headers: BROWSER_HEADERS,
        });
        const text = await r.text();
        // Extract server IDs from /server/XXXXXX patterns
        const matches = text.matchAll(/\/server\/([a-zA-Z0-9]{4,8})/g);
        const ids = [...new Set([...matches].map(m => m[1]))];
        results[key] = {
          status: r.status,
          contentType: r.headers.get('content-type'),
          byteLength: text.length,
          preview: text.slice(0, 300),
          serverIdsFound: ids.slice(0, 20),
        };
      } catch (e) {
        results[key] = { error: String(e) };
      }
    }),
  );

  return NextResponse.json(results, { headers: { 'Cache-Control': 'no-store' } });
}
