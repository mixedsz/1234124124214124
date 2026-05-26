import { NextResponse } from 'next/server';

const CHANNEL_ID = 'UChl49qE7X_bOhdZmO6Hv4EA';
const UPLOADS_PLAYLIST = 'UU' + CHANNEL_ID.slice(2);

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  try {
    // Primary: YouTube Data API v3 (requires YOUTUBE_API_KEY env var)
    if (apiKey) {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST}&maxResults=1&key=${apiKey}`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (res.ok) {
        const data = await res.json();
        const item = data.items?.[0]?.snippet;
        if (item?.resourceId?.videoId) {
          return NextResponse.json(
            { videoId: item.resourceId.videoId, title: item.title ?? '' },
            { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } }
          );
        }
      }
    }

    // Secondary: YouTube RSS feed
    const rss = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (rss.ok) {
      const xml = await rss.text();
      const videoIdMatch = xml.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/);
      const titleMatch = xml.match(/<entry>[\s\S]*?<title>([^<]+)<\/title>/);
      if (videoIdMatch) {
        return NextResponse.json(
          {
            videoId: videoIdMatch[1],
            title: titleMatch
              ? titleMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
              : '',
          },
          { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } }
        );
      }
    }
  } catch {
    // fall through
  }

  return NextResponse.json(null);
}
