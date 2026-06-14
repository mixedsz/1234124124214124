import { put, list } from '@vercel/blob';

export interface ShowcaseVideo {
  videoId: string;
  title: string;
  updatedAt: string;
}

const PATHNAME = 'showcase-video.json';

export async function readShowcaseVideo(): Promise<ShowcaseVideo | null> {
  try {
    const { blobs } = await list({ prefix: PATHNAME });
    if (!blobs.length) return null;
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function writeShowcaseVideo(video: ShowcaseVideo): Promise<void> {
  await put(PATHNAME, JSON.stringify(video), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}
