import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const BLOB_PATHNAME = 'reviews.json';

export interface Review {
  id: string;
  discord_id: string;
  username: string;
  avatar_url?: string;
  rating: number; // 1-5
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

// GET /api/reviews — public, returns all reviews sorted newest first
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product_id');
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  const reviews = await readReviews();
  let filtered = reviews;

  if (productId) {
    filtered = reviews.filter(r => String(r.product_id) === productId);
  }

  const sorted = filtered
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);

  const avgRating = sorted.length
    ? sorted.reduce((sum, r) => sum + r.rating, 0) / sorted.length
    : 0;

  return NextResponse.json({ reviews: sorted, total: sorted.length, avg_rating: avgRating });
}

// POST /api/reviews — creates a review
export async function POST(request: NextRequest) {
  let body: Partial<Review & { action?: string; review_id?: string }>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (body.action === 'delete' && body.review_id) {
    const reviews = await readReviews();
    const updated = reviews.filter(r => r.id !== body.review_id);
    if (updated.length === reviews.length) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    await writeReviews(updated);
    return NextResponse.json({ success: true });
  }

  const { discord_id, username, rating, content } = body;
  if (!discord_id || !username || !rating || !content) {
    return NextResponse.json(
      { error: 'Required fields: discord_id, username, rating, content' },
      { status: 400 }
    );
  }

  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 });
  }

  if (content.length > 1000) {
    return NextResponse.json({ error: 'Review content must be 1000 characters or less' }, { status: 400 });
  }

  const reviewId = body.id || `${Date.now()}-${discord_id}`;
  const createdAt = body.created_at || new Date().toISOString();

  const review: Review = {
    id: reviewId,
    discord_id,
    username,
    avatar_url: body.avatar_url,
    rating,
    content: content.trim(),
    product_name: body.product_name,
    product_id: body.product_id,
    verified_purchase: body.verified_purchase ?? false,
    created_at: createdAt,
  };

  try {
    const reviews = await readReviews();
    if (body.id && reviews.some(r => r.id === body.id)) {
      return NextResponse.json({ error: 'Review already exists' }, { status: 409 });
    }
    reviews.push(review);
    await writeReviews(reviews);
  } catch (err) {
    console.error('Failed to save review:', err);
    return NextResponse.json({ error: `Failed to save review: ${(err as Error).message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true, review }, { status: 201 });
}

// DELETE /api/reviews?id=... OR DELETE /api/reviews?username=...
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const username = searchParams.get('username');

  if (!id && !username) {
    return NextResponse.json({ error: 'Review id or username required' }, { status: 400 });
  }

  const reviews = await readReviews();

  if (username) {
    const updated = reviews.filter(r => r.username !== username);
    const deleted = reviews.length - updated.length;
    await writeReviews(updated);
    return NextResponse.json({ success: true, deleted });
  }

  const updated = reviews.filter(r => r.id !== id);
  if (updated.length === reviews.length) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }
  await writeReviews(updated);
  return NextResponse.json({ success: true });
}
