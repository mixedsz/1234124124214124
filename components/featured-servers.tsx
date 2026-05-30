'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { getServerIds } from '@/lib/server-list';

interface CfxData {
  hostname?: string;
  projectName?: string;
  clients?: number;
  sv_maxclients?: number;
  iconVersion?: number;
}

interface Server {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  icon: string | null;
}

const DEFAULT_IDS = ['l7o9o4', 'ql64g9', 'javxzp', 'yjbqg5', '7b9kqrb'];

function stripColors(s: string) {
  return s.replace(/\^[0-9]/g, '').replace(/[^\x20-\x7E]/g, '').trim();
}

function cleanName(name: string): string {
  return name.split('|')[0].trim() || name;
}

async function fetchServer(id: string): Promise<Server | null> {
  try {
    const r = await fetch(`https://frontend.cfx-services.net/api/servers/single/${id}`);
    if (!r.ok) return null;
    const j = await r.json();
    const d: CfxData = j?.Data ?? {};
    const iv = d.iconVersion;
    return {
      id,
      name: stripColors(d.projectName || d.hostname || 'Unknown'),
      players: d.clients ?? 0,
      maxPlayers: d.sv_maxclients ?? 0,
      icon: iv != null ? `https://frontend.cfx-services.net/api/servers/icon/${id}/${iv}.png` : null,
    };
  } catch { return null; }
}

export function FeaturedServers() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(DEFAULT_IDS.map(fetchServer))
      .then(results => {
        const live = results.filter((s): s is Server => s !== null);
        setServers(live);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && servers.length === 0) return null;

  return (
    <section className="py-16 bg-neutral-900 border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Used by top FiveM servers</h2>
        <p className="text-neutral-500 mb-10">
          Some of the biggest names in the FiveM community are running our scripts.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-[72px] bg-neutral-800/60 rounded-xl animate-pulse" />
              ))
            : servers.map(server => (
                <a
                  key={server.id}
                  href={`https://cfx.re/join/${server.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3.5 bg-neutral-800/60 hover:bg-neutral-700/80 border border-neutral-700/50 hover:border-neutral-600 rounded-xl transition-all"
                >
                  {server.icon ? (
                    <img
                      src={server.icon}
                      alt={cleanName(server.name)}
                      className="w-11 h-11 rounded-lg object-cover flex-shrink-0 ring-1 ring-white/10"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-lg bg-neutral-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-neutral-300 text-xs font-bold">
                        {cleanName(server.name).slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm leading-tight truncate">
                      {cleanName(server.name)}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Users className="w-3 h-3 text-neutral-500 flex-shrink-0" />
                      <span className="text-neutral-400 text-xs">
                        {server.players.toLocaleString()} / {server.maxPlayers.toLocaleString()}
                      </span>
                      <span className="ml-auto flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-green-400 text-[10px] font-bold uppercase tracking-wide">Live</span>
                      </span>
                    </div>
                  </div>
                </a>
              ))}
        </div>
      </div>
    </section>
  );
}
