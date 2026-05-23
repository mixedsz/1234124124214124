'use client';

import { Header } from '@/components/header';
import { getCategories, TebexCategory, TebexPackage, formatPrice } from '@/lib/tebex';
import { Footer } from '@/components/footer';
import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBasket } from '@/hooks/use-basket';

// Helper to strip HTML tags and convert to plain text
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<TebexPackage[]>([]);
  const [scripts, setScripts] = useState<TebexPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { itemCount } = useBasket();

  useEffect(() => {
    async function load() {
      try {
        const cats: TebexCategory[] = await fetch('/api/categories').then(r => r.json());
        // Find subscription categories
        const subCats = cats.filter((cat: TebexCategory) => 
          cat.name.toLowerCase().includes('subscription') || 
          cat.name.toLowerCase().includes('recurring')
        );
        // Get non-subscription categories for "What's Included"
        const scriptCats = cats.filter((cat: TebexCategory) => 
          !cat.name.toLowerCase().includes('subscription') && 
          !cat.name.toLowerCase().includes('recurring')
        );
        
        // Combine all subscription packages
        const allSubs = subCats.flatMap((cat: TebexCategory) => cat.packages || []);
        setSubscriptions(allSubs);
        
        // Get first 5 scripts for "What's Included"
        const allScripts = scriptCats.flatMap((cat: TebexCategory) => cat.packages || []);
        setScripts(allScripts.slice(0, 5));
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
      <Header basketCount={itemCount} />

      {/* Page Header */}
      <section className="border-b border-neutral-800 bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
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
          <div className="grid md:grid-cols-2 gap-8">
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
              const isRecommended = idx === subscriptions.length - 1 && subscriptions.length > 1;
              const hasDiscount = sub.discount && sub.discount > 0;
              const cleanDescription = stripHtml(sub.description);
              
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
                      BEST VALUE
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-white mb-2">{sub.name}</h3>
                  
                  {/* Price - DO NOT divide by 100, Tebex returns actual price */}
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">
                      {formatPrice(sub.total_price, sub.currency)}
                    </span>
                    <p className="text-neutral-400 text-sm mt-2">
                      {sub.name.toLowerCase().includes('month') ? 'per month' : 'per period'}
                    </p>
                  </div>

                  {/* Description - stripped of HTML */}
                  {cleanDescription && (
                    <p className="text-neutral-300 mb-6">{cleanDescription}</p>
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

        {/* What's Included Section */}
        {scripts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-4xl font-bold text-white text-center mb-3">{"What's Included"}</h2>
            <p className="text-neutral-500 text-center mb-12">
              Get all of our current scripts, plus new scripts on release day, automatically.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scripts.map((script) => (
                <Link 
                  key={script.id} 
                  href={`/product/${script.id}`}
                  className="block bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-700 hover:border-blue-500/50 transition group"
                >
                  <div className="aspect-video bg-neutral-700 overflow-hidden">
                    {script.image ? (
                      <img 
                        src={script.image} 
                        alt={script.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-blue-600/10">
                        <span className="text-3xl font-bold text-blue-500/50">{script.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  {/* Framework badges */}
                  <div className="flex gap-1.5 px-4 pt-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-500/90 text-white">QBCORE</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-yellow-500/90 text-black">QBOX</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-orange-500/90 text-white">ESX</span>
                  </div>
                  <div className="p-4 pt-2">
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition">{script.name}</h3>
                  </div>
                </Link>
              ))}

              {/* "+ all future releases!" card */}
              <div className="bg-gradient-to-b from-neutral-700/50 to-transparent h-full rounded-2xl p-[1px] hidden lg:block">
                <div className="w-full h-full bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-2xl flex items-center justify-center min-h-[280px]">
                  <div className="text-2xl font-bold text-white/75 items-center flex gap-2">
                    <span className="text-blue-400 font-bold text-5xl leading-none" style={{ textShadow: '0 0 20px rgba(59,130,246,0.5)' }}>+</span>
                    all future releases!
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
