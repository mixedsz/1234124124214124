'use client';

import { Header } from '@/components/header';
import { getCategories, TebexCategory, TebexPackage } from '@/lib/tebex';
import { ProductCard } from '@/components/product-card';
import { Footer } from '@/components/footer';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useBasket } from '@/hooks/use-basket';

export default function StorePage() {
  const [categories, setCategories] = useState<TebexCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { itemCount } = useBasket();

  useEffect(() => {
    async function load() {
      try {
        const cats = await fetch('/api/categories').then(r => r.json());
        // Filter out subscription categories - they should only be on subscription page
        const filteredCats = cats.filter((cat: TebexCategory) => 
          !cat.name.toLowerCase().includes('subscription') && 
          !cat.name.toLowerCase().includes('recurring')
        );
        setCategories(filteredCats);
      } catch {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const visiblePackages: TebexPackage[] = (() => {
    const categoryPackages = activeCategory === null
      ? categories.flatMap(cat => cat.packages || [])
      : (categories.find(cat => cat.id === activeCategory)?.packages || []);
    
    // Filter by search query
    return categoryPackages.filter(pkg =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  })();

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header basketCount={itemCount} />

      {/* Page Header */}
      <section className="border-b border-neutral-800 bg-neutral-900/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-white mb-4">Scripts</h1>
          <p className="text-neutral-400">Browse all available scripts and resources</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {error && (
          <div className="mb-8 bg-red-900/20 border border-red-900 rounded-lg p-4 text-red-200">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search scripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

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
            <p className="text-neutral-400 text-lg">No products available{searchQuery ? ' matching your search' : ' in this category'}.</p>
            <p className="text-neutral-500 text-sm mt-2">Try another category or check back later.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
