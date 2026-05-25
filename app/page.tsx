import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { getCategories, getWebstore, TebexPackage } from '@/lib/tebex';
import { readReviews } from '@/lib/reviews';
import Link from 'next/link';
import { ArrowRight, Star, CloudDownload, Heart, Shield, Headphones } from 'lucide-react';
export const revalidate = 60;

const REVIEWS = [
  { text: "good and fast services im talking everything yu need highly recommend ‼️🔥", author: "@ImJustTeejayyll" },
  { text: "I've been buying scripts from Flake since I first started my server, and every single one has been straight 🔥. Flake recently presented an opportunity for the GW-inspired base, and me and my partner jumped on it right away. Between the open-source scripts and the custom ones he's built personally, the quality and attention to detail speak for themselves. I've seen the hours he puts in to perfect his work — dude's dedicated. Flake is a one-stop shop for anything you need to elevate your FiveM server. Can't recommend him enough. 💯", author: "@WAR" },
  { text: "flake is solid. all scripts i have installed in my server seamless and clean even when i was just starting they were straight to the point. 10/10", author: "@⭒" },
  { text: "10/10 good and fast🐐", author: "@Aj" },
  { text: "10/10 Got me right", author: "@TextRead" },
  { text: "10/10 🔥 🔥", author: "@Loso143" },
  { text: "10/10 fire ass scripts", author: "@LoyalFamKash" },
  { text: "10/10 Got me right", author: "@HDJONTV" },
  { text: "Fast service as always", author: "@H2" },
  { text: "Flake is more than quick service, gives you reassurance every minute in the ticket. He doesn't just take your money and go offline — once you send money he sends you the product. 10/10, fuck that 10000/10", author: "@noface." },
  { text: "1000/10 Service 💯💯💯 fast customer service and goes above and beyond to make sure you get what you need help with. Def gonna continue shopping here!!", author: "@SlapzThaDon" },
  { text: "100000000/10... was frustrated getting a script config but Flake made sure the mission was complete ✅ before closing the ticket 💯 will be returning for more scripts fashooo", author: "@MrWicsTV" },
  { text: "That grizzly world base so fye, Flake did his thing with every script 💯, no waiting no gimmicks. If you're looking to get it don't hesitate. Money well spent 💯‼️ ⭐️⭐️⭐️⭐️ 5 star service wtf is the yelp page", author: "@Jaqyn" },
  { text: "Best fivem Base on the market and the scripts work better than the originals ⭐ ⭐ ⭐ ⭐ ⭐ 10stars all around no cap. Everything is drag and drop", author: "@AlonzoHarris" },
  { text: "10/10 fast support 💯", author: "@Fancy" },
  { text: "10/10 got to me fast", author: "@JUNECBFW" },
  { text: "1000/10 thank you so much for my custom teleport! i love it 😊", author: "@L.A.Y.L.A" },
  { text: "MY DUDE HAS THE BESTTTT CROSSHAIR IVE EVER USED IN A CITY", author: "@breezyhimself" },
  { text: "10/10 SERVICE QUICK AND FAST GONE GET YOU RIGHT BEST OUT", author: "@Yungestsmacca" },
  { text: "shout out to Flake manee", author: "@Josiah" },
  { text: "this mf move fast as hell ngl, best customer service!! 10/10 highly recommend!!", author: "@Vxtone" },
  { text: "W scripts 10/10 🤙🏼", author: "@Aron" },
  { text: "Quicc response and good service.", author: "@ARS3LL" },
  { text: "If you got Flake you need no one else. Quick, fast, and very efficient, 10/10.", author: "@KING" },
  { text: "10/10 good services highly recommend don't miss out 🔥", author: "@H" },
  { text: "Came back in got me right very professional 🔥", author: "@H" },
  { text: "Flake 100%. Fast with the response and the service.", author: "@Unknown" },
  { text: "Fire cooking script get yours no regrets 🔥🔥🔥 10/10 must recommend", author: "@H" },
  { text: "Flake 100%. Fast with the response get me right everytime", author: "@LoyalFamKash" },
  { text: "Appreciate the quick responds and helping me out, if you had a rate system ill rate it 100%... Keep up the good work", author: "@MvpSquad" },
  { text: "Plug Script is nice! Thanx bro I appreciate the quick process!", author: "@H2" },
  { text: "Another fire script! Physical therapy! no issues! Appreciate it!", author: "@H2" },
  { text: "Blackmarket script is 💯! 3 scripts for 50% is a crazy deal, Goodlooking", author: "@H2" },
  { text: "Just installed busttop in our server. Another W!!!", author: "@H2" },
  { text: "the best 1000/100000 he never fails me", author: "@Kenzo14" },
  { text: "he js too teed 100000%", author: "@cdotalt" },
  { text: "Best Service Hands Down 💯", author: "@SMILEY" },
  { text: "10/10 best service 💗", author: "@L.A.Y.L.A" },
  { text: "just brought another script got 5 scripts all together from bro best service without question 💯🤝🏾", author: "@SMILEY" },
  { text: "Fastest Service I've ever had getting scripts. I will be back!!", author: "@buckwi1d730" },
  { text: "solid store fast an reliable! very helpful 100/100", author: "@⭒" },
  { text: "Let s goooo! Flake 💯 Fast and taught me some valuable info", author: "@H2" },
  { text: "trust worthy and honest service reliable fast and quick responding, always willing to help with little questions.", author: "@mdosha" },
  { text: "10/10 best service i will be getting more scripts", author: "@HDJONTV" },
  { text: "10/10 💯", author: "@Hitman" },
];

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
  const [webstore, categories] = await Promise.all([
    getWebstore(),
    getCategories(),
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
  const displayReviews = mappedApiReviews.length >= 6
    ? mappedApiReviews
    : [...mappedApiReviews, ...REVIEWS].slice(0, Math.max(REVIEWS.length, mappedApiReviews.length));

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
            <div className="max-w-3xl">
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

              {/* Feature list below browse button */}
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
          </div>
        </section>

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
                { value: '40', suffix: 'K', label: 'Sales' },
                { value: '42', suffix: 'K', label: 'Servers using Flake Scripts*' },
                { value: '158', suffix: 'K', label: 'Players enjoying Flake Scripts*' },
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
                const avatarSrc = (review as {avatar_url?: string; discord_id?: string}).avatar_url
                  || ((review as {discord_id?: string}).discord_id && isSnowflake((review as {discord_id?: string}).discord_id!)
                    ? `/api/discord-avatar?id=${(review as {discord_id?: string}).discord_id}`
                    : null);
                const createdAt = (review as {created_at?: string}).created_at;
                return (
                  <div
                    key={i}
                    className="w-[320px] lg:w-[360px] flex-shrink-0 flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
                  >
                    {/* Avatar + username */}
                    <div className="flex items-center gap-4 mb-6">
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt={name}
                          className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xl ${avatarBg(name)}`}>
                          {name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-white font-semibold text-base leading-tight">{name}</span>
                    </div>

                    {/* Stars – right-aligned */}
                    <div className="flex gap-1 justify-end mb-4">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="text-neutral-300 text-sm leading-relaxed line-clamp-5 flex-1">
                      &ldquo;{review.text}&rdquo;
                    </p>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-neutral-800">
                      <span className="text-neutral-600 text-xs">{createdAt ? fmtDate(createdAt) : ''}</span>
                      <span className="px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
                        VERIFIED PURCHASE
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
    </div>
  );
}
