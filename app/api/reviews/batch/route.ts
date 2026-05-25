import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const BLOB_PATHNAME = 'reviews.json';

interface Review {
  id: string;
  discord_id: string;
  username: string;
  avatar_url?: string;
  rating: number;
  content: string;
  product_name?: string;
  product_id?: number;
  verified_purchase: boolean;
  created_at: string;
}

async function readReviews(): Promise<Review[]> {
  if (!BLOB_TOKEN) return [];
  try {
    const listRes = await fetch(
      `https://blob.vercel-storage.com?prefix=${BLOB_PATHNAME}&limit=1`,
      { headers: { Authorization: `Bearer ${BLOB_TOKEN}` } }
    );
    if (!listRes.ok) return [];
    const { blobs } = await listRes.json();
    if (!blobs?.length) return [];
    const dataRes = await fetch(blobs[0].url, { cache: 'no-store' });
    if (!dataRes.ok) return [];
    return await dataRes.json();
  } catch {
    return [];
  }
}

async function writeReviews(reviews: Review[]): Promise<void> {
  if (!BLOB_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN is not set');
  const res = await fetch(
    `https://blob.vercel-storage.com/${BLOB_PATHNAME}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${BLOB_TOKEN}`,
        'x-api-version': '7',
        'content-type': 'application/json',
        'x-add-random-suffix': '0',
        'x-cache-control-max-age': '0',
        'x-access': 'private',
      },
      body: JSON.stringify(reviews),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Blob write failed (${res.status}): ${text}`);
  }
}

// POST /api/reviews/batch — atomically import multiple reviews in one write
export async function POST(request: NextRequest) {
  let body: { reviews: Partial<Review>[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!Array.isArray(body.reviews) || body.reviews.length === 0) {
    return NextResponse.json({ error: 'reviews array required' }, { status: 400 });
  }

  const existing = await readReviews();
  const existingIds = new Set(existing.map(r => r.id));

  let imported = 0;
  let skipped = 0;
  let failed = 0;
  const toAdd: Review[] = [];

  for (const item of body.reviews) {
    const { discord_id, username, rating, content, id } = item;
    if (!discord_id || !username || !rating || !content) { failed++; continue; }
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) { failed++; continue; }
    if (id && existingIds.has(id)) { skipped++; continue; }

    const reviewId = id || `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
    existingIds.add(reviewId);

    toAdd.push({
      id: reviewId,
      discord_id,
      username,
      avatar_url: item.avatar_url,
      rating,
      content: content.trim().slice(0, 1000),
      product_name: item.product_name,
      product_id: item.product_id,
      verified_purchase: item.verified_purchase ?? false,
      created_at: item.created_at || new Date().toISOString(),
    });
    imported++;
  }

  if (toAdd.length > 0) {
    try {
      await writeReviews([...existing, ...toAdd]);
    } catch (err) {
      return NextResponse.json({ error: `Failed to save: ${(err as Error).message}` }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, imported, skipped, failed }, { status: 201 });
}
