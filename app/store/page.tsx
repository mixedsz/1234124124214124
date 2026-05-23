'use client';

import { Header } from '@/components/header';
import { getCategories, TebexCategory, TebexPackage } from '@/lib/tebex';
import { ProductCard } from '@/components/product-card';
import { Footer } from '@/components/footer';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StorePage() {
  const [categories, setCategories] = useState<TebexCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const cats = await fetch('/api/categories').then(r => r.json());
        setCategories(cats);
      } catch {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const visiblePackages: TebexPackage[] = activeCategory === null
    ? categories.flatMap(cat => cat.packages || [])
    : (categories.find(cat => cat.id === activeCategory)?.packages || []);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header basketCount={0} />

      {/* Page Header */}
      <section className="border-b border-neutral-800 bg-neutral-900/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-white mb-4">Scripts</h1>
          <p className="text-neutral-400">Browse all available scripts and resources</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {error && (
          <div className="mb-8 bg-red-900/20 border border-red-900 rounded-lg p-4 text-red-200">
            {error}
          </div>
        )}

        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 animate-pulse">
                <div className="aspect-[4/3] bg-neutral-800" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-neutral-800 rounded w-3/4" />
                  <div className="h-4 bg-neutral-800 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : visiblePackages.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visiblePackages.map((pkg) => (
              <ProductCard key={pkg.id} package_={pkg} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Search className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg">No products available in this category.</p>
            <p className="text-neutral-500 text-sm mt-2">Try another category or check back later.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
