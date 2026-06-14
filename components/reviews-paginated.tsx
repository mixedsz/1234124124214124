'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface Review {
  text: string;
  author: string;
  avatar_url?: string;
  discord_id?: string;
  created_at?: string;
}

const AVATAR_COLORS = ['bg-blue-600','bg-purple-600','bg-green-600','bg-rose-600','bg-orange-500','bg-indigo-600','bg-teal-600','bg-pink-600'];
function avatarBg(str: string) {
  const hash = [...str].reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
function fmtDate(s: string) {
  const d = new Date(s);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}
function isSnowflake(id?: string) { return !!id && /^\d{17,19}$/.test(id); }

const PAGE_SIZE = 6;

export function ReviewsPaginated({ reviews }: { reviews: Review[] }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);
  const pageReviews = reviews.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
        {pageReviews.map((review, i) => {
          const name = review.author.startsWith('@') ? review.author.slice(1) : review.author;
          const avatarSrc = review.avatar_url
            || (isSnowflake(review.discord_id) ? `/api/discord-avatar?id=${review.discord_id}` : null);
          return (
            <div
              key={i}
              className="flex flex-col bg-[#1e1f22] border border-white/[0.06] rounded-2xl p-5 shadow-lg"
            >
              <div className="flex items-start gap-3 mb-4">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-white/10 mt-0.5"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/10 mt-0.5 ${avatarBg(name)}`}>
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-white font-semibold text-sm leading-tight truncate max-w-[200px]">{name}</p>
                  <div className="flex gap-0.5 mt-1.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-neutral-400 text-sm leading-relaxed line-clamp-5 flex-1">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
                <span className="text-neutral-600 text-xs">{review.created_at ? fmtDate(review.created_at) : ''}</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
                  VERIFIED PURCHASE
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === page ? 'bg-blue-500 scale-125' : 'bg-neutral-600 hover:bg-neutral-400'}`}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
