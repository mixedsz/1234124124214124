import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/tebex';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
