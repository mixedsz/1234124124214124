'use client';

import { Header } from '@/components/header';
import { getCategories, TebexCategory, TebexPackage } from '@/lib/tebex';
import { Footer } from '@/components/footer';
import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<TebexPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const cats = await fetch('/api/categories').then(r => r.json());
        // Find subscription categories
        const subCats = cats.filter((cat: TebexCategory) => 
          cat.name.toLowerCase().includes('subscription') || 
          cat.name.toLowerCase().includes('recurring')
        );
        // Combine all subscription packages
        const allSubs = subCats.flatMap(cat => cat.packages || []);
        setSubscriptions(allSubs);
      } catch (err) {
        console.error('Error loading subscriptions:', err);
        setError('Failed to load subscriptions. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header basketCount={0} />

      {/* Page Header */}
      <section className="border-b border-neutral-800 bg-neutral-900/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-white mb-4">Subscriptions</h1>
          <p className="text-neutral-400">Get unlimited access to all our scripts with premium features</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {error && (
          <div className="mb-8 bg-red-900/20 border border-red-900 rounded-lg p-4 text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-neutral-800 rounded-xl p-8 animate-pulse">
                <div className="h-8 bg-neutral-700 rounded w-1/3 mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-neutral-700 rounded w-full" />
                  <div className="h-4 bg-neutral-700 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : subscriptions.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {subscriptions.map((sub, idx) => {
              const basePrice = sub.base_price || 0;
              const totalPrice = sub.total_price || basePrice;
              const hasDiscount = sub.discount && sub.discount > 0;
              const discountPercent = hasDiscount ? Math.round((sub.discount / basePrice) * 100) : 0;
              const isRecommended = idx === subscriptions.length - 1 && subscriptions.length > 1;
              
              return (
                <div
                  key={sub.id}
                  className={`rounded-xl p-8 border-2 transition ${
                    isRecommended
                      ? 'border-blue-500 bg-neutral-800/50'
                      : 'border-neutral-700 bg-neutral-800/30'
                  }`}
                >
                  {/* Badge for recommended */}
                  {isRecommended && hasDiscount && (
                    <div className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full mb-4">
                      SAVE {discountPercent}%
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-white mb-2">{sub.name}</h3>
                  
                  {/* Price */}
                  <div className="mb-6">
                    {hasDiscount ? (
                      <>
                        <span className="text-4xl font-bold text-blue-400">
                          ${(totalPrice / 100).toFixed(2)}
                        </span>
                        <span className="text-neutral-500 line-through ml-3">
                          ${(basePrice / 100).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-white">
                        ${(totalPrice / 100).toFixed(2)}
                      </span>
                    )}
                    <p className="text-neutral-400 text-sm mt-2">
                      {sub.name.toLowerCase().includes('month') ? 'per month' : 'per year'}
                    </p>
                  </div>

                  {/* Description */}
                  {sub.description && (
                    <p className="text-neutral-300 mb-6 line-clamp-3">{sub.description}</p>
                  )}

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-neutral-300">
                      <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      Access to all current scripts
                    </li>
                    <li className="flex items-center gap-3 text-neutral-300">
                      <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      Access to all future scripts
                    </li>
                    <li className="flex items-center gap-3 text-neutral-300">
                      <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      Priority support
                    </li>
                    <li className="flex items-center gap-3 text-neutral-300">
                      <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      Early access to new features
                    </li>
                    <li className="flex items-center gap-3 text-neutral-300">
                      <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      Exclusive Discord channels
                    </li>
                    <li className="flex items-center gap-3 text-neutral-300">
                      <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      Script customization help
                    </li>
                  </ul>

                  {/* Subscribe Button */}
                  <Link
                    href={`/product/${sub.id}`}
                    className={`block text-center px-6 py-3 font-semibold rounded-lg transition ${
                      isRecommended
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-neutral-700 text-white hover:bg-neutral-600'
                    }`}
                  >
                    Subscribe Now
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-neutral-400 text-lg mb-4">No subscriptions available at the moment.</p>
            <p className="text-neutral-500 text-sm">
              Check back soon or{' '}
              <Link href="/store" className="text-blue-400 hover:text-blue-300">
                browse our scripts
              </Link>
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
