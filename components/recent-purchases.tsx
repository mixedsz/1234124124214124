'use client';

import { useState, useEffect, useCallback } from 'react';
import { CreditCard } from 'lucide-react';

interface Buyer {
  username: string;
  packageName: string;
  avatarUrl: string | null;
}

interface TooltipState {
  username: string;
  packageName: string;
  x: number;
  y: number;
}

const AVATAR_COLORS = [
  'bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-rose-600',
  'bg-orange-500', 'bg-indigo-600', 'bg-teal-600', 'bg-pink-600',
];
function avatarBg(s: string) {
  const h = [...s].reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export function RecentPurchases() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const loadAvatars = useCallback(async (list: { username: string; packageName: string }[]) => {
    const CONCURRENCY = 3;
    let i = 0;
    async function next() {
      if (i >= list.length) return;
      const { username } = list[i++];
      await fetch(`/api/fivem-avatar?username=${encodeURIComponent(username)}`)
        .then(r => r.json())
        .then(({ url }) => {
          if (url) setBuyers(prev => prev.map(b => b.username === username ? { ...b, avatarUrl: url } : b));
        })
        .catch(() => {})
        .finally(() => next());
    }
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, list.length) }, next));
  }, []);

  const load = useCallback(async () => {
    try {
      const list: { username: string; packageName: string }[] = await fetch('/api/recent-purchases').then(r => r.json());
      setBuyers(list.map(({ username, packageName }) => ({ username, packageName, avatarUrl: null })));
      setLoaded(true);
      loadAvatars(list);
    } catch {
      setLoaded(true);
    }
  }, [loadAvatars]);

  useEffect(() => {
    load();
    const id = setInterval(() => {
      if (!document.hidden) load();
    }, 120_000);
    return () => clearInterval(id);
  }, [load]);

  if (loaded && buyers.length === 0) return null;

  return (
    <section className="py-10 bg-neutral-900 border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Recent Purchases</h2>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-green-600/40 bg-green-950/60">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            <span className="text-green-400 text-xs font-bold tracking-widest">LIVE</span>
          </div>
        </div>

        {/* Avatar strip */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {!loaded
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-16 h-16 rounded-2xl bg-neutral-800 animate-pulse flex-shrink-0" />
              ))
            : buyers.map((b, i) => (
                <div
                  key={i}
                  className={`relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-neutral-800 flex items-center justify-center text-white font-bold text-xl cursor-default ${avatarBg(b.username)}`}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({
                      username: b.username,
                      packageName: b.packageName,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  {b.username.charAt(0).toUpperCase()}
                  {b.avatarUrl && (
                    <img
                      src={b.avatarUrl}
                      alt={b.username}
                      width={64}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                </div>
              ))}
        </div>
      </div>

      {/* Fixed tooltip — outside overflow container so it's never clipped */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y - 10, transform: 'translate(-50%, -100%)' }}
        >
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 whitespace-nowrap shadow-xl">
            <p className="text-white text-xs font-semibold">{tooltip.username}</p>
            {tooltip.packageName && (
              <p className="text-neutral-400 text-[11px] mt-0.5 max-w-[180px] truncate">{tooltip.packageName}</p>
            )}
          </div>
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-neutral-800 border-r border-b border-neutral-700 rotate-45 -mt-[5px]" />
          </div>
        </div>
      )}
    </section>
  );
}
