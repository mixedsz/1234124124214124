import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { RecentPurchases } from '@/components/recent-purchases';
import { SaleNotification } from '@/components/sale-notification';
import { getCategories, getWebstore, TebexPackage } from '@/lib/tebex';
import { readReviews } from '@/lib/reviews';
import Link from 'next/link';
import { ArrowRight, Star, CloudDownload, Heart, Shield, Headphones } from 'lucide-react';
export const revalidate = 60;

async function fetchYouTubeRSS(channelId: string): Promise<{ videoId: string; title: string } | null> {
  try {
    const rssRes = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { cache: 'no-store', signal: AbortSignal.timeout(4000) }
    );
    if (!rssRes.ok) return null;
    const xml = await rssRes.text();
    const videoIdMatch = xml.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/);
    const titleMatch = xml.match(/<entry>[\s\S]*?<title>([^<]+)<\/title>/);
    if (!videoIdMatch) return null;
    return {
      videoId: videoIdMatch[1],
      title: titleMatch ? titleMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '',
    };
  } catch {
    return null;
  }
}

async function getLatestYouTubeVideo(): Promise<{ videoId: string; title: string } | null> {
  return fetchYouTubeRSS('UChl49qE7X_bOhdZmO6Hv4EA');
}

const FEATURES = [
  {
    icon: <CloudDownload className="w-10 h-10" strokeWidth={1.3} />,
    title: "Instant Delivery",
    desc: "Available within minutes in your Cfx.re Portal account.",
  },
  {
    icon: <Heart className="w-10 h-10" strokeWidth={1.3} />,
    title: "Free Updates Forever",
    desc: "We promise to never charge you for an update, not even a v2.",
  },
  {
    icon: <Shield className="w-10 h-10" strokeWidth={1.3} />,
    title: "Escrow Protection",
    desc: "All scripts are securely delivered via Cfx.re escrow.",
  },
  {
    icon: <Headphones className="w-10 h-10" strokeWidth={1.3} />,
    title: "Dedicated Support",
    desc: "Get help quickly via our Discord support channels.",
  },
];

const AVATAR_COLORS = ['bg-blue-600','bg-purple-600','bg-green-600','bg-rose-600','bg-orange-500','bg-indigo-600','bg-teal-600','bg-pink-600'];
function avatarBg(str: string) {
  const hash = [...str].reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
function fmtDate(s: string) {
  const d = new Date(s);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}
function isSnowflake(id: string) { return /^\d{17,19}$/.test(id); }

export default async function HomePage() {
  const [webstore, categories, latestVideo] = await Promise.all([
    getWebstore(),
    getCategories(),
    getLatestYouTubeVideo().catch(() => null),
  ]);

  const storeName = webstore?.name || 'Flake Development';

  // Get all packages from all categories for best sellers
  const allPackages: TebexPackage[] = [];
  for (const cat of categories) {
    if (cat.packages) {
      allPackages.push(...cat.packages);
    }
  }

  const bestSellers = allPackages.slice(0, 6);

  // Fetch real reviews; pad with static if fewer than 6 to keep marquee speed consistent
  const apiReviews = await readReviews().catch(() => []);
  const seen = new Set<string>();
  const mappedApiReviews = apiReviews
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .filter(r => {
      const key = `${r.discord_id}:${r.content.trim()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 50)
    .map(r => ({ text: r.content, author: r.username, avatar_url: r.avatar_url, discord_id: r.discord_id, created_at: r.created_at }));
  const displayReviews = mappedApiReviews;

  // Double the reviews for seamless infinite scroll
  const doubledReviews = [...displayReviews, ...displayReviews];

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden bg-neutral-900">
          {/* Subtle blue glow background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px]" />
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: text + feature list */}
              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight text-balance">
                  The most popular scripts for your FiveM server.
                </h1>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/scripts"
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-neutral-200 transition"
                  >
                    Browse Scripts
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/subscription"
                    className="text-blue-400 hover:text-blue-300 transition text-sm font-medium"
                  >
                    Get our full collection for $35/month.{' '}
                    <span className="underline">Learn more →</span>
                  </Link>
                </div>

                {/* Feature list */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FEATURES.map((f, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="flex-shrink-0 text-blue-500">
                        {f.icon}
                      </div>
                      <div>
                        <p className="text-white font-bold text-base">{f.title}</p>
                        <p className="text-neutral-500 text-sm mt-0.5">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Script Showcase video card */}
              <div className="hidden lg:block">
                <div className="bg-neutral-800/40 rounded-2xl overflow-hidden border border-neutral-700/60 shadow-2xl">
                  {/* Card header */}
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
                  {/* Video */}
                  <div className="aspect-video">
                    <iframe
                      src={latestVideo
                        ? `https://www.youtube.com/embed/${latestVideo.videoId}`
                        : 'https://www.youtube.com/embed/Zolwhtx1VAg'}
                      title={latestVideo?.title || 'Flake Development Script Showcase'}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  {/* Caption */}
                  <div className="px-4 py-3 text-center">
                    <p className="text-neutral-400 text-xs italic">See our premium scripts in action</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <RecentPurchases />

        {/* Best Sellers Section */}
        <section className="py-16 bg-neutral-900 border-t border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                  <polyline points="16 7 22 7 22 13"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Best Sellers</h2>
            </div>

            {bestSellers.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bestSellers.map((pkg) => (
                    <ProductCard key={pkg.id} package_={pkg} />
                  ))}
                </div>
                <div className="mt-10 flex justify-center">
                  <Link
                    href="/scripts"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-semibold border border-blue-600/30 transition"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-neutral-900 rounded-xl">
                <p className="text-neutral-500">
                  {process.env.NEXT_PUBLIC_TEBEX_PUBLIC_TOKEN
                    ? 'No products available yet. Add products to your Tebex store.'
                    : 'Please configure your Tebex Public Token to display products.'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-neutral-900 border-t border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  10% off your first purchase
                </h2>
                <p className="text-neutral-400 mb-6">
                  Subscribe to our newsletter to get product announcements, news, exclusive discounts, 10% off your first purchase and more right to your inbox.
                </p>
                <form className="flex gap-3">
                  <input
                    type="email"
                    placeholder="handle@example.info"
                    className="flex-1 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500 transition"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="mt-3 text-xs text-neutral-500">
                  By clicking subscribe you accept our{' '}
                  <Link href="/privacy" className="underline hover:text-neutral-300 transition">privacy statement</Link>. Discount code is for new subscribers only.
                </p>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl w-full max-w-xs">
                  <p className="text-xs text-neutral-500 mb-1 uppercase tracking-widest">Newsletter</p>
                  <p className="text-2xl font-bold text-white mb-1">Stay Updated</p>
                  <p className="text-neutral-400 text-sm">Get exclusive deals and early access to new releases.</p>
                  <div className="mt-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs text-neutral-500">Subscribers get first look at new scripts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-20 bg-neutral-900 border-t border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Achievements</h2>
            <p className="text-neutral-500 mb-16">
              {"We've been around for over 3 years and are one of the fastest growing creators on the platform."}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-2">
              {[
                { value: '15', suffix: 'K', label: 'Sales' },
                { value: '20', suffix: 'K', label: 'Servers using Flake Scripts*' },
                { value: '65', suffix: 'K', label: 'Players enjoying Flake Scripts*' },
              ].map((stat) => (
                <div key={stat.label} className="w-full text-center leading-none">
                  <div
                    className="font-black text-[80px] leading-[67.5px] xl:leading-[100px] xl:text-[120px] bg-gradient-to-br from-blue-400 to-blue-700 inline-block text-transparent bg-clip-text"
                    style={{ textShadow: '0 0 100px rgba(59,130,246,0.3)' }}
                  >
                    <span>{stat.value}</span>
                    <span className="text-[60px] xl:text-[80px]">{stat.suffix}</span>
                  </div>
                  <p className="font-medium text-neutral-500 text-base xl:text-lg mt-4 xl:mt-8">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section - Infinite Scroll */}
        <section className="py-20 bg-neutral-900 border-t border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white text-center mb-3">Reviews</h2>
            <p className="text-neutral-500 text-center mb-0">
              {"We've received 400+ five star reviews from our customers."}
            </p>
          </div>

          <div className="reviews-wrapper flex flex-row overflow-hidden mt-12">
            <div className="animate-marquee flex gap-4 pl-4">
              {doubledReviews.map((review, i) => {
                const name = review.author.startsWith('@') ? review.author.slice(1) : review.author;
                const discordId = (review as {discord_id?: string}).discord_id;
                const storedUrl = (review as {avatar_url?: string}).avatar_url;
                const avatarSrc = storedUrl
                  || (discordId && isSnowflake(discordId)
                    ? `/api/discord-avatar?id=${discordId}`
                    : null);
                const createdAt = (review as {created_at?: string}).created_at;
                return (
                  <div
                    key={i}
                    className="w-[300px] lg:w-[340px] flex-shrink-0 flex flex-col bg-[#1e1f22] border border-white/[0.06] rounded-2xl p-5 shadow-lg"
                  >
                    {/* Avatar + name + stars — all left-aligned */}
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

                    {/* Review text */}
                    <p className="text-neutral-400 text-sm leading-relaxed line-clamp-5 flex-1">
                      &ldquo;{review.text}&rdquo;
                    </p>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
                      <span className="text-neutral-600 text-xs">{createdAt ? fmtDate(createdAt) : ''}</span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
                        VERIFIED
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-16 bg-neutral-900 border-t border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Trusted by the best</h2>
            <p className="text-neutral-500 mb-12">
              {"We're partnered with some of the biggest names in the FiveM community."}
            </p>
            <div className="flex flex-wrap gap-12 items-center justify-center opacity-40">
              {['QBCore', 'Qbox', 'ESX', 'OCRP', 'LB-Phone'].map((partner) => (
                <span key={partner} className="text-white text-xl font-bold tracking-wider">
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer storeName={storeName} />
      <SaleNotification />
    </div>
  );
}
