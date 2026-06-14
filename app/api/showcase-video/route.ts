import { NextRequest, NextResponse } from 'next/server';
import { readShowcaseVideo, writeShowcaseVideo } from '@/lib/showcase-video';

export const dynamic = 'force-dynamic';

function extractVideoId(input: string): string | null {
  const m = input.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  return null;
}

// GET /api/showcase-video — returns current manually-set video (or null)
export async function GET() {
  const video = await readShowcaseVideo();
  return NextResponse.json(video);
}

// POST /api/showcase-video — Discord bot calls this to update the video
// Body: { videoUrl: string, title?: string }
// Auth: Authorization: Bearer <BLOB_WEBHOOK_PUBLIC_KEY>
export async function POST(request: NextRequest) {
  const secret = process.env.BLOB_WEBHOOK_PUBLIC_KEY;
  const auth = request.headers.get('authorization');
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { videoUrl?: string; title?: string };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { videoUrl, title } = body;
  if (!videoUrl) return NextResponse.json({ error: 'videoUrl is required' }, { status: 400 });

  const videoId = extractVideoId(videoUrl);
  if (!videoId) return NextResponse.json({ error: 'Could not extract a valid YouTube video ID from that URL' }, { status: 400 });

  await writeShowcaseVideo({ videoId, title: title || '', updatedAt: new Date().toISOString() });
  return NextResponse.json({ success: true, videoId });
}
