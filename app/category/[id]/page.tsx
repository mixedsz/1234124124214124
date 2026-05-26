import { Header } from '@/components/header';
import { getCategory } from '@/lib/tebex';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default async function CategoryPage({ params }: { params: { id: string } }) {
  let category = null;
  let error = null;

  try {
    category = await getCategory(Number(params.id));
  } catch (err) {
    console.error('[CategoryPage] Error:', err);
    error = 'Failed to load category';
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <>
            <Link
              href="/scripts"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
            <div className="bg-red-900/20 border border-red-900 rounded-lg p-8 text-red-200 flex gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Category Not Found</h3>
                <p>{error}</p>
              </div>
            </div>
          </>
        ) : category ? (
          <>
            <Link
              href="/scripts"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>

            <div className="mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">{category.name}</h1>
              <p className="text-slate-400 text-lg">{category.description}</p>
            </div>

            {(category as any).packages && (category as any).packages.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(category as any).packages.map((pkg: any) => (
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
              <div className="text-center py-12">
                <p className="text-slate-400">No products in this category yet.</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading category...</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="mx-auto max-w-7xl text-center text-slate-400">
          <p>© 2024 FiveM Store. All rights reserved. Powered by Tebex.</p>
        </div>
      </footer>
    </div>
  );
}
