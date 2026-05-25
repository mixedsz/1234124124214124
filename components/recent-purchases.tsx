'use client';

import { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';

interface Buyer {
  username: string;
  avatarUrl: string | null;
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

  async function load() {
    try {
      const list: { username: string }[] = await fetch('/api/recent-purchases').then(r => r.json());
      const withAvatars: Buyer[] = await Promise.all(
        list.map(async ({ username }) => {
          try {
            const { url } = await fetch(`/api/fivem-avatar?username=${encodeURIComponent(username)}`).then(r => r.json());
            return { username, avatarUrl: url ?? null };
          } catch {
            return { username, avatarUrl: null };
          }
        })
      );
      setBuyers(withAvatars);
    } catch {
      /* silent — hide section if API unavailable */
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hide entirely if no data came back after loading
  if (loaded && buyers.length === 0) return null;

  return (
    <section className="py-6 bg-neutral-900 border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-neutral-800/60 border border-neutral-700/50 p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-700 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-4 h-4 text-neutral-400" />
              </div>
              <span className="text-white font-bold text-lg">Recent Purchases</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-green-600/40 bg-green-950/60">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <span className="text-green-400 text-xs font-bold tracking-widest">LIVE</span>
            </div>
          </div>

          {/* Avatar strip */}
          <div className="rounded-xl bg-neutral-900/60 px-4 py-4">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {!loaded
                ? Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="w-16 h-16 rounded-2xl bg-neutral-700 animate-pulse flex-shrink-0" />
                  ))
                : buyers.map((b, i) => (
                    <div
                      key={i}
                      title={b.username}
                      className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-neutral-700/60"
                    >
                      {b.avatarUrl ? (
                        <img
                          src={b.avatarUrl}
                          alt={b.username}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-white font-bold text-xl ${avatarBg(b.username)}`}>
                          {b.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
