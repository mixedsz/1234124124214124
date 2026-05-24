import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const REVIEWS_FILE = path.join(process.cwd(), 'data', 'reviews.json');

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
  try {
    const raw = await fs.readFile(REVIEWS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeReviews(reviews: Review[]): Promise<void> {
  await fs.mkdir(path.dirname(REVIEWS_FILE), { recursive: true });
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf-8');
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

  // Sort newest first, cap at limit
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

  // Handle delete action
  if (body.action === 'delete' && body.review_id) {
    const reviews = await readReviews();
    const updated = reviews.filter(r => r.id !== body.review_id);
    if (updated.length === reviews.length) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    await writeReviews(updated);
    return NextResponse.json({ success: true });
  }

  // Validate required fields
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

  const review: Review = {
    id: `${Date.now()}-${discord_id}`,
    discord_id,
    username,
    avatar_url: body.avatar_url,
    rating,
    content: content.trim(),
    product_name: body.product_name,
    product_id: body.product_id,
    verified_purchase: body.verified_purchase ?? false,
    created_at: new Date().toISOString(),
  };

  try {
    const reviews = await readReviews();
    reviews.push(review);
    await writeReviews(reviews);
  } catch (err) {
    console.error('Failed to save review:', err);
    return NextResponse.json({ error: `Failed to save review: ${(err as Error).message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true, review }, { status: 201 });
}

// DELETE /api/reviews?id=...
export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Review id required' }, { status: 400 });
  }

  const reviews = await readReviews();
  const updated = reviews.filter(r => r.id !== id);
  if (updated.length === reviews.length) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }
  await writeReviews(updated);
  return NextResponse.json({ success: true });
}
