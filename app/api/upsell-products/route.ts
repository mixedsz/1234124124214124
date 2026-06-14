import { NextResponse } from 'next/server';
import { getPackages } from '@/lib/tebex';

export const revalidate = 300;

export async function GET() {
  try {
    const packages = await getPackages();
    // Shuffle and return up to 8 for the client to further filter by cart contents
    const shuffled = [...packages].sort(() => Math.random() - 0.5);
    return NextResponse.json(shuffled.slice(0, 8).map(p => ({
      id: p.id,
      name: p.name,
      image: p.image,
      base_price: p.base_price,
      total_price: p.total_price,
      discount: p.discount,
      currency: p.currency,
    })));
  } catch {
    return NextResponse.json([]);
  }
}
