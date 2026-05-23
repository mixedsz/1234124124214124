import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { getCategories, getWebstore, TebexPackage } from '@/lib/tebex';
import Link from 'next/link';
import { Star, ArrowRight, CloudDownload, Heart, Headphones, Code } from 'lucide-react';

export const revalidate = 60;

const reviews = [
  {
    text: "I want to express my deep appreciation for the staff. They are always respectful and kind to us members, and truly admire the hard work they put into these scripts. They're simply amazing - the best I've ever come across. Much love to all the staff!",
    author: "@f_xzz",
  },
  {
    text: "I had far more issues than just implementing the script. The support team went way beyond and helped me not only add the script but made sure ALL aspects were working correctly! Amazing support and amazing scripts.",
    author: "@whodeyreloaded",
  },
  {
    text: "I am truly impressed with both scripts! They are incredibly easy to use and install. Customizing and making changes is straightforward. The design and versatile functionality really stand out and have exceeded my expectations.",
    author: "@gcp137",
  },
  {
    text: "Best scripts on the market hands down. The attention to detail is incredible and the support team is always there when you need them. Worth every penny!",
    author: "@serverowner42",
  },
  {
    text: "These scripts transformed my server completely. Players love the new features and I couldn't be happier with the quality. Highly recommend to anyone serious about their FiveM server.",
    author: "@fivemdev",
  },
  {
    text: "Outstanding quality and even better support. The documentation is thorough and the Discord community is super helpful. This is what premium should look like.",
    author: "@rpworld",
  },
];

export default async function HomePage() {
  const [webstore, categories] = await Promise.all([
    getWebstore(),
    getCategories(),
  ]);

  const storeName = webstore?.name || 'Flake Development';

  // Get all packages from all categories
  const allPackages: TebexPackage[] = [];
  for (const cat of categories) {
    if (cat.packages) {
      allPackages.push(...cat.packages);
    }
  }

  // Get best sellers (first 6 packages)
  const bestSellers = allPackages.slice(0, 6);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header basketCount={0} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden bg-black">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Text */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  The most popular vehicle scripts for your FiveM server.
                </h1>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/store"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition"
                  >
                    Browse Scripts
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/subscription"
                    className="text-blue-500 hover:text-blue-400 transition text-sm"
                  >
                    Get our full collection for £35/month.{' '}
                    <span className="underline">Learn more</span>
                  </Link>
                </div>
              </div>

              {/* Right - Product Preview */}
              <div className="relative">
                {bestSellers.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {bestSellers.slice(0, 4).map((pkg) => (
                      <Link
                        key={pkg.id}
                        href={`/product/${pkg.id}`}
                        className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-blue-500/50 transition group"
                      >
                        {pkg.image && (
                          <img
                            src={pkg.image}
                            alt={pkg.name}
                            className="w-full aspect-video object-cover group-hover:scale-105 transition"
                          />
                        )}
                        <div className="p-3">
                          <p className="text-white text-sm font-medium truncate">{pkg.name}</p>
                          <p className="text-blue-500 text-sm">
                            {pkg.currency} {pkg.total_price.toFixed(2)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-black border-t border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 flex flex-shrink-0 justify-center items-center text-blue-500">
                  <CloudDownload className="w-12 h-12" strokeWidth={1.3} />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Instant Delivery</p>
                  <p className="text-sm text-neutral-500">Available within minutes in your Cfx.re Portal account.</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 flex flex-shrink-0 justify-center items-center text-blue-500">
                  <Heart className="w-12 h-12" strokeWidth={1.3} />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Free Updates Forever</p>
                  <p className="text-sm text-neutral-500">We promise to never charge you for an update, not even a v2.</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 flex flex-shrink-0 justify-center items-center text-blue-500">
                  <Headphones className="w-12 h-12" strokeWidth={1.3} />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Unmatched Support</p>
                  <p className="text-sm text-neutral-500">We aim to answer all tickets within 24 hours on Discord.</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 flex flex-shrink-0 justify-center items-center text-blue-500">
                  <Code className="w-12 h-12" strokeWidth={1.3} />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Escrow Protected</p>
                  <p className="text-sm text-neutral-500">Code is protected with FiveM asset escrow.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Sellers Section */}
        <section className="py-16 bg-black">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-xl text-blue-500">&#x1F525;</span>
              <h2 className="text-2xl font-bold text-white">Best Sellers</h2>
            </div>

            {bestSellers.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bestSellers.map((pkg) => (
                    <ProductCard key={pkg.id} package_={pkg} />
                  ))}
                </div>
                <div className="flex justify-center mt-8">
                  <Link
                    href="/store"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500/10 text-blue-500 font-semibold hover:bg-blue-500/20 transition"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-neutral-900 rounded-xl border border-neutral-800">
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
        <section className="py-16 bg-neutral-900">
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
                    className="flex-1 px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="mt-3 text-xs text-neutral-500">
                  By clicking subscribe you accept our <Link href="/privacy" className="underline">privacy statement</Link>. Discount code is for new subscribers only.
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-neutral-800 flex items-center justify-center">
                  <div className="bg-neutral-800 rounded-xl p-6 shadow-2xl">
                    <div className="text-sm text-neutral-400 mb-2">2200</div>
                    <div className="text-xl font-bold text-white">Contacts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-24 bg-black">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Achievements</h2>
            <p className="text-neutral-500 mb-16">
              {"We've been around for over 3 years and are one of the fastest growing creators on the platform."}
            </p>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-2">
              <div className="text-center">
                <div className="font-black text-6xl lg:text-8xl xl:text-[120px] bg-gradient-to-br from-blue-400 to-blue-800 inline-block text-transparent bg-clip-text leading-none">
                  <span>40</span><span className="text-5xl lg:text-6xl xl:text-[80px]">K</span>
                </div>
                <p className="font-medium text-neutral-500 text-base xl:text-xl mt-4 xl:mt-8">Sales</p>
              </div>
              <div className="text-center">
                <div className="font-black text-6xl lg:text-8xl xl:text-[120px] bg-gradient-to-br from-blue-400 to-blue-800 inline-block text-transparent bg-clip-text leading-none">
                  <span>42</span><span className="text-5xl lg:text-6xl xl:text-[80px]">K</span>
                </div>
                <p className="font-medium text-neutral-500 text-base xl:text-xl mt-4 xl:mt-8">Servers using Flake scripts*</p>
              </div>
              <div className="text-center">
                <div className="font-black text-6xl lg:text-8xl xl:text-[120px] bg-gradient-to-br from-blue-400 to-blue-800 inline-block text-transparent bg-clip-text leading-none">
                  <span>158</span><span className="text-5xl lg:text-6xl xl:text-[80px]">K</span>
                </div>
                <p className="font-medium text-neutral-500 text-base xl:text-xl mt-4 xl:mt-8">Players enjoying Flake scripts*</p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-24 bg-black overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Reviews</h2>
              <p className="text-neutral-500">
                {"We've received 400+ five star reviews from our customers."}
              </p>
            </div>

            {/* Marquee Reviews */}
            <div className="relative overflow-hidden">
              <div className="flex gap-4 animate-marquee">
                {[...reviews, ...reviews].map((review, i) => (
                  <div
                    key={i}
                    className="w-[320px] lg:w-[350px] flex-shrink-0 bg-neutral-900 rounded-xl p-6 border border-neutral-800"
                  >
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-blue-500 text-blue-500" />
                      ))}
                    </div>
                    <p className="text-neutral-300 text-sm mb-4 line-clamp-5">
                      {review.text}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-neutral-600">{review.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-16 bg-black border-t border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by the best</h2>
            <p className="text-neutral-500 mb-12">
              {"We're partnered with some of the biggest names in the FiveM community."}
            </p>
            <div className="flex flex-wrap gap-8 lg:gap-16 items-center justify-center opacity-50">
              <div className="text-neutral-400 text-xl font-bold">OCRP</div>
              <div className="text-neutral-400 text-xl font-bold">QBCore</div>
              <div className="text-neutral-400 text-xl font-bold">Wasabi</div>
              <div className="text-neutral-400 text-xl font-bold">LB</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
