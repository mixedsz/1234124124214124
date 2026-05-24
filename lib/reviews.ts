import { put, list } from '@vercel/blob';

export interface Review {
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

const BLOB_PATHNAME = 'reviews.json';

export async function readReviews(): Promise<Review[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME });
    if (!blobs.length) return [];
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function writeReviews(reviews: Review[]): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(reviews), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}
