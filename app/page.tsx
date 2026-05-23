import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { getCategories, getWebstore, TebexPackage } from '@/lib/tebex';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const [webstore, categories] = await Promise.all([
    getWebstore(),
    getCategories(),
  ]);

  const storeName = webstore?.name || 'FiveM Store';
  const storeLogo = webstore?.logo;

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
      <Header basketCount={0} storeName={storeName} logo={storeLogo} />

      <main className="flex-1">
        {/* Announcement Bar */}
        <div className="bg-black py-3 border-b border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 text-center lg:text-left justify-between items-center">
              <Link href="/subscription" className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition">
                <span className="text-yellow-500">🏆</span>
                <span className="text-sm font-medium">Tebex Top Creator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

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
                    className="text-orange-500 hover:text-orange-400 transition text-sm"
                  >
                    Get our full collection for £35/month.{' '}
                    <span className="underline">Learn more →</span>
                  </Link>
                </div>
              </div>

              {/* Right - Hero Image/Visual */}
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/5 border border-neutral-800 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4 p-8">
                      <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                        <div className="text-xs text-neutral-500 mb-1">Vehicle Colours</div>
                        <div className="h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg"></div>
                      </div>
                      <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                        <div className="text-xs text-neutral-500 mb-1">Acceleration</div>
                        <div className="h-20 bg-gradient-to-t from-neutral-800 to-neutral-700 rounded-lg flex items-end justify-center pb-2">
                          <div className="w-16 h-12 bg-orange-500/20 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Sellers Section */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-xl">🔥</span>
              <h2 className="text-2xl font-bold text-black">Best Sellers</h2>
            </div>

            {bestSellers.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bestSellers.map((pkg) => (
                    <ProductCard key={pkg.id} package_={pkg} />
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link
                    href="/store"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neutral-900 text-white font-semibold hover:bg-neutral-800 transition"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-neutral-100 rounded-xl">
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
                    className="flex-1 px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
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
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-neutral-800 flex items-center justify-center">
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
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-black mb-4">Achievements</h2>
            <p className="text-neutral-500 mb-12">
              {"We've been around for over 3 years and are one of the fastest growing creators on the platform."}
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-5xl font-bold text-black mb-2">0k</div>
                <div className="text-neutral-500">Sales</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-black mb-2">0k</div>
                <div className="text-neutral-500">Servers using scripts*</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-black mb-2">0k</div>
                <div className="text-neutral-500">Players enjoying scripts*</div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-16 bg-white border-t border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">Reviews</h2>
              <p className="text-neutral-500">
                {"We've received 400+ five star reviews from our customers."}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  text: "I want to express my deep appreciation for the staff. They are always respectful and kind to us members, and truly admire the hard work they put into these scripts. They're simply amazing – the best I've ever come across. [...] Much love to all the staff, especially the creator of these incredible scripts!",
                  author: "@f_xzz",
                  platform: "Discord"
                },
                {
                  text: "I had far more issues than just implementing the script. The support team went way beyond and helped me not only add the script but made sure ALL aspects [of my server] were working correctly! Amazing support and amazing scripts, what more could you ask for?",
                  author: "@whodeyreloaded",
                  platform: "Discord"
                },
                {
                  text: "I am truly impressed with both scripts! They are incredibly easy to use and install. Customizing and making changes is straightforward. The design and versatile functionality really stand out and have exceeded my expectations. I would definitely buy them again! Keep up the great work!",
                  author: "@gcp137",
                  platform: "Discord"
                }
              ].map((review, i) => (
                <div key={i} className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-orange-500 text-orange-500" />
                    ))}
                  </div>
                  <p className="text-neutral-700 text-sm mb-4 line-clamp-6">
                    {review.text}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-neutral-400">💬</span>
                    <span className="text-neutral-600">{review.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-16 bg-white border-t border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-black mb-4">Trusted by the best</h2>
            <p className="text-neutral-500">
              {"We've partnered with some of the biggest names in the FiveM community."}
            </p>
          </div>
        </section>
      </main>

      <Footer storeName={storeName} />
    </div>
  );
}
