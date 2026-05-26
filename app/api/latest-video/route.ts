import { NextResponse } from 'next/server';

const FALLBACK = { videoId: 'Zolwhtx1VAg', title: 'Flake Development Script Showcase' };
const CHANNEL_ID = 'UChl49qE7X_bOhdZmO6Hv4EA';

export async function GET() {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return NextResponse.json(FALLBACK);
    const xml = await res.text();
    const videoIdMatch = xml.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/);
    const titleMatch = xml.match(/<entry>[\s\S]*?<title>([^<]+)<\/title>/);
    if (!videoIdMatch) return NextResponse.json(FALLBACK);
    return NextResponse.json(
      {
        videoId: videoIdMatch[1],
        title: titleMatch
          ? titleMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          : '',
      },
      { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } }
    );
  } catch {
    return NextResponse.json(FALLBACK);
  }
}
