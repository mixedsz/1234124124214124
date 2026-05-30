import { NextResponse } from 'next/server';
import { getPackages } from '@/lib/tebex';

export const revalidate = 300;

export async function GET() {
  try {
    const packages = await getPackages();
    const sale = packages.filter(p => p.discount > 0);
    return NextResponse.json(sale);
  } catch {
    return NextResponse.json([]);
  }
}
