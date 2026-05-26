'use client';

import { useEffect, useState } from 'react';

const FALLBACK = { videoId: 'Zolwhtx1VAg', title: 'Flake Development Script Showcase' };

export function ScriptShowcase() {
  const [video, setVideo] = useState(FALLBACK);

  useEffect(() => {
    fetch('/api/latest-video')
      .then(r => r.json())
      .then(data => { if (data?.videoId) setVideo(data); })
      .catch(() => {});
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
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="px-4 py-3 text-center">
        <p className="text-neutral-400 text-xs italic">See our premium scripts in action</p>
      </div>
    </div>
  );
}
