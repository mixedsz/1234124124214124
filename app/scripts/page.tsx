'use client';

import { Header } from '@/components/header';
import { getCategories, TebexCategory, TebexPackage } from '@/lib/tebex';
import { ProductCard } from '@/components/product-card';
import { Footer } from '@/components/footer';
import { Search } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useBasket } from '@/contexts/basket-context';
import { useSearchParams } from 'next/navigation';

function StoreContent() {
  const [categories, setCategories] = useState<TebexCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fiveMToast, setFiveMToast] = useState(false);
  const { refreshBasket, username } = useBasket();
  const searchParams = useSearchParams();

  useEffect(() => {
    document.title = 'Scripts | Flake Development | QBCore, Qbox & ESX FiveM Scripts';
  }, []);

  // Check for login success - show FiveM toast
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setFiveMToast(true);
      // Refresh basket to get authenticated state
      refreshBasket();
      // Auto-hide message after 5 seconds
      setTimeout(() => setFiveMToast(false), 5000);
      // Clean up URL
      window.history.replaceState({}, '', '/scripts');
    }
  }, [searchParams, refreshBasket]);

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
    <>
      {/* FiveM Connected Toast */}
      {fiveMToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-orange-500/15 border border-orange-500/30 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-2xl animate-fade-in">
          <img 
            src="/fivem-logo.png" 
            alt="FiveM" 
            className="w-7 h-7 object-contain flex-shrink-0"
            style={{ mixBlendMode: 'lighten' }}
          />
          <div>
            <p className="text-white font-semibold text-sm">FiveM Connected!</p>
            <p className="text-orange-300 text-xs mt-0.5">{username ? `Logged in as ${username}` : 'Authentication successful'}</p>
          </div>
        </div>
      )}

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

      {/* Feature strip */}
      <div className="mt-12 pt-8 border-t border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5c0 1.1-.1 2.12-.1 3.14A2.86 2.86 0 0013 11c1.6 0 2.5-1.56 2.5-3a3.5 3.5 0 013.5 3.5c0 2.5-2 4.5-4.5 4.5H4zm0 0v4"/></svg>, title: "Instant Delivery", desc: "Available within minutes in your Cfx.re Portal account." },
          { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>, title: "Free Updates Forever", desc: "We promise to never charge you for an update, not even a v2." },
          { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Secure & Performant", desc: "Low resmon usage, secured events & designed for scale." },
          { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>, title: "Easy Setup", desc: "Quick and easy setup, with support available 24/7." },
        ].map((f, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-600/15 flex items-center justify-center text-blue-400">
              {f.icon}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{f.title}</p>
              <p className="text-neutral-500 text-xs mt-0.5 leading-snug">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function StorePage() {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="border-b border-neutral-800 bg-neutral-900/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-white mb-4">Scripts</h1>
          <p className="text-neutral-400">Browse all available scripts and resources</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <Suspense fallback={
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
        }>
          <StoreContent />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
