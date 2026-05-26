'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

interface Server {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  icon: string | null;
  url: string;
}

export function FeaturedServers() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fivem-servers')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setServers(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && servers.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {loading
        ? Array.from({ length: 1 }).map((_, i) => (
            <div key={i} className="w-64 h-20 bg-neutral-800 rounded-xl animate-pulse" />
          ))
        : servers.map(server => (
            <a
              key={server.id}
              href={server.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-4 bg-neutral-800/60 hover:bg-neutral-700/80 border border-neutral-700/50 hover:border-neutral-600 rounded-xl transition-all group min-w-[220px]"
            >
              {server.icon ? (
                <img
                  src={server.icon}
                  alt={server.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0 ring-1 ring-white/10"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-neutral-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-neutral-300 text-sm font-bold">
                    {server.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{server.name}</p>
                <div className="flex items-center gap-1.5 text-neutral-400 text-xs mt-0.5">
                  <Users className="w-3 h-3 flex-shrink-0" />
                  <span>{server.players.toLocaleString()} / {server.maxPlayers.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-[10px] font-bold tracking-wide uppercase">Live</span>
                </div>
              </div>
            </a>
          ))}
    </div>
  );
}
