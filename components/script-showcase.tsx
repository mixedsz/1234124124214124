'use client';

import { useEffect, useState } from 'react';

type Video = { videoId: string; title: string };

export function ScriptShowcase() {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetch('/api/latest-video')
      .then(r => r.json())
      .then(data => { if (data?.videoId) setVideo(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-neutral-800/40 rounded-2xl overflow-hidden border border-neutral-700/60 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-800/80 border-b border-neutral-700/60">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-red-600/20 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="currentColor" className="text-red-400">
              <path d="M6 4l15 8l-15 8z"/>
            </svg>
          </div>
          <span className="text-white text-[11px] font-bold tracking-wider uppercase">Script Showcase</span>
        </div>
        <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded tracking-widest uppercase">LIVE DEMO</span>
      </div>

      <div className="aspect-video bg-neutral-900">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="text-neutral-700">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z"/>
            </svg>
          </div>
        ) : video ? (
          playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              className="relative w-full h-full group"
              aria-label={`Play ${video.title}`}
            >
              <img
                src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </button>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-neutral-600 text-sm">No video available</p>
          </div>
        )}
      </div>

      <div className="px-4 py-3 text-center">
        <p className="text-neutral-400 text-xs italic">See our premium scripts in action</p>
      </div>
    </div>
  );
}
