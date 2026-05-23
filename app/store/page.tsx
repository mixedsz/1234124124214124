import { Header } from '@/components/header';
import { getCategories } from '@/lib/tebex';
import { ProductCard } from '@/components/product-card';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default async function StorePage() {
  let categories = [];
  let error = null;

  try {
    categories = await getCategories();
  } catch (err) {
    console.error('[StorePage] Error:', err);
    error = 'Failed to load products. Please try again later.';
  }

  // Flatten all packages from categories
  const allPackages = categories.flatMap(cat => cat.packages || []);

  return (
    <div className="min-h-screen bg-black">
      <Header basketCount={0} />

      {/* Header */}
      <section className="border-b border-neutral-800 bg-neutral-900/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-white mb-4">Scripts</h1>
          <p className="text-neutral-400">Browse all available scripts and resources</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 bg-red-900/20 border border-red-900 rounded-lg p-4 text-red-200">
            {error}
          </div>
        )}

        {/* Categories Navigation */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium">
              All
            </button>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-sm font-medium transition"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {allPackages.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allPackages.map((pkg) => (
              <ProductCard key={pkg.id} package_={pkg} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Search className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg">No products available yet.</p>
            <p className="text-neutral-500 text-sm mt-2">Check back later or contact support.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center text-neutral-400">
          <p>Powered by Tebex</p>
        </div>
      </footer>
    </div>
  );
}
