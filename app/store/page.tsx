import { Header } from '@/components/header';
import { getPackages } from '@/lib/tebex';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default async function StorePage() {
  let packages = [];
  let error = null;

  try {
    packages = await getPackages();
  } catch (err) {
    console.error('[StorePage] Error:', err);
    error = 'Failed to load products. Please try again later.';
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header basketItemCount={0} />

      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-white mb-4">Store</h1>
          <p className="text-slate-400">Browse all available products and items</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 bg-red-900/20 border border-red-900 rounded-lg p-4 text-red-200">
            {error}
          </div>
        )}

        {packages.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Link
                key={pkg.id}
                href={`/product/${pkg.id}`}
                className="group bg-slate-900 rounded-lg overflow-hidden border border-slate-800 hover:border-blue-600/50 transition transform hover:scale-105"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center relative overflow-hidden">
                  {pkg.image && (
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition">
                    {pkg.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {pkg.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-400">
                      ${pkg.price.toFixed(2)}
                    </span>
                    {pkg.quantity > 0 ? (
                      <span className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No products available yet.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center text-slate-400">
          <p>© 2024 FiveM Store. All rights reserved. Powered by Tebex.</p>
        </div>
      </footer>
    </div>
  );
}
