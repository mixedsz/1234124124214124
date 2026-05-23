import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { getCategories, getWebstore, TebexPackage } from '@/lib/tebex';
import Link from 'next/link';
import { ArrowRight, Star, CloudDownload, Heart, Shield, Headphones } from 'lucide-react';

export const revalidate = 60;

const REVIEWS = [
  {
    text: "I want to express my deep appreciation for Flake Development. They are always respectful and responsive, and I truly admire the hard work they put into these scripts. They're simply amazing – the best I've ever come across. Much love to Trey and the team!",
    author: "@f_xzz",
  },
  {
    text: "I had far more issues than just implementing the script. Flake went way beyond and helped me not only add the script but made sure ALL aspects of my server were working correctly! Amazing support and amazing scripts, what more could you ask for?",
    author: "@whodeyreloaded",
  },
  {
    text: "I am truly impressed with Flake's scripts! They are incredibly easy to use and install. Customizing and making changes is straightforward. The design and versatile functionality really stand out and have exceeded my expectations. Would definitely buy again!",
    author: "@gcp137",
  },
  {
    text: "Hands down the best FiveM scripts I've used. Trey's attention to detail is incredible and the support response time is unmatched. Every update brings something new and they listen to the community. 10/10 would recommend to any server owner.",
    author: "@serverdev99",
  },
  {
    text: "Been using Flake Development scripts for over a year now. The quality is consistently high and the free updates policy is something no other creator does. My players absolutely love the immersion these scripts bring.",
    author: "@roleplayer42",
  },
  {
    text: "The documentation is thorough and the scripts work out of the box. Had a small config question and Trey answered within minutes. This is how every FiveM resource should be sold and supported.",
    author: "@adminlife",
  },
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

  // Double the reviews for seamless infinite scroll
  const doubledReviews = [...REVIEWS, ...REVIEWS];

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header basketCount={0} storeName={storeName} />

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
                  href="/store"
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
              <span className="text-xl">🔥</span>
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
                    href="/store"
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
              {doubledReviews.map((review, i) => (
                <div
                  key={i}
                  className="w-[320px] lg:w-[350px] flex-shrink-0 flex flex-col justify-between bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
                >
                  <div>
                    <div className="flex gap-1 text-blue-500 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-5 h-5 fill-blue-500 text-blue-500" />
                      ))}
                    </div>
                    <p className="text-neutral-300 text-sm leading-relaxed line-clamp-5">
                      {review.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-5 text-sm text-neutral-500">
                    {/* Discord Icon */}
                    <svg className="w-4 h-4 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                    </svg>
                    <span>{review.author}</span>
                  </div>
                </div>
              ))}
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
