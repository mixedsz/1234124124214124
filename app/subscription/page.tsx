'use client';

import { Header } from '@/components/header';
import { TebexCategory, TebexPackage, createBasket, getAuthUrl } from '@/lib/tebex';
import { useCurrency } from '@/contexts/currency-context';
import { Footer } from '@/components/footer';
import { Check } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useBasket } from '@/contexts/basket-context';
import { useRouter } from 'next/navigation';

function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<TebexPackage[]>([]);
  const [scripts, setScripts] = useState<TebexPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupIndex, setGroupIndex] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [pendingSubId, setPendingSubId] = useState<number | null>(null);
  const [adding, setAdding] = useState<number | null>(null);
  const { itemCount, isAuthenticated, addItem, basket, refreshBasket } = useBasket();
  const { formatPrice } = useCurrency();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    document.title = 'Subscriptions | Flake Development | QBCore, Qbox & ESX FiveM Scripts';
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const cats: TebexCategory[] = await fetch('/api/categories').then(r => r.json());
        const subCats = cats.filter((cat: TebexCategory) =>
          cat.name.toLowerCase().includes('subscription') ||
          cat.name.toLowerCase().includes('recurring')
        );
        const scriptCats = cats.filter((cat: TebexCategory) =>
          !cat.name.toLowerCase().includes('subscription') &&
          !cat.name.toLowerCase().includes('recurring')
        );
        const allSubs = subCats.flatMap((cat: TebexCategory) => cat.packages || []);
        setSubscriptions(allSubs);
        const seen = new Set<number>();
        const allScripts = scriptCats
          .flatMap((cat: TebexCategory) => cat.packages || [])
          .filter(pkg => { if (seen.has(pkg.id)) return false; seen.add(pkg.id); return true; });
        setScripts([...allScripts].sort(() => Math.random() - 0.5));
      } catch {
        setError('Failed to load subscriptions. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // After returning from FiveM auth, auto-add the pending subscription
  useEffect(() => {
    if (!isAuthenticated) return;
    const pending = localStorage.getItem('tebex_fivem_auth_pending');
    const pendingId = localStorage.getItem('tebex_pending_sub_id');
    if (!pending || !pendingId) return;
    localStorage.removeItem('tebex_fivem_auth_pending');
    localStorage.removeItem('tebex_pending_sub_id');
    const subId = Number(pendingId);
    setAdding(subId);
    addItem(subId, 1)
      .then(() => router.push('/cart'))
      .catch(() => setAdding(null));
  }, [isAuthenticated, addItem, router]);

  useEffect(() => {
    if (scripts.length <= 5) return;
    intervalRef.current = setInterval(() => {
      setGroupIndex(prev => {
        const totalGroups = Math.ceil(scripts.length / 5);
        return (prev + 1) % totalGroups;
      });
    }, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [scripts.length]);

  const displayedScripts = scripts.slice(groupIndex * 5, groupIndex * 5 + 5);

  const handleSubscribeNow = useCallback(async (sub: TebexPackage) => {
    if (!isAuthenticated) {
      setPendingSubId(sub.id);
      setShowLoginModal(true);
      return;
    }
    setAdding(sub.id);
    try {
      await addItem(sub.id, 1);
      router.push('/cart');
    } catch {
      setAdding(null);
    }
  }, [isAuthenticated, addItem, router]);

  const handleFiveMLogin = async () => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const BASKET_KEY = 'tebex_basket_ident';
      let ident = localStorage.getItem(BASKET_KEY);
      if (!ident) {
        const origin = window.location.origin;
        const b = await createBasket(`${origin}/cart`, `${origin}/checkout-complete`);
        if (!b) throw new Error('Could not create a session. Please try again.');
        ident = b.ident;
        localStorage.setItem(BASKET_KEY, ident);
      }
      const returnUrl = `${window.location.origin}/subscription`;
      const authUrl = await getAuthUrl(ident, returnUrl);
      if (!authUrl) throw new Error('Could not get authentication URL. Please try again.');
      localStorage.setItem('tebex_fivem_auth_pending', '1');
      if (pendingSubId !== null) localStorage.setItem('tebex_pending_sub_id', String(pendingSubId));
      window.location.replace(authUrl);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header />

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
              const isAdding = adding === sub.id;

              return (
                <div
                  key={sub.id}
                  className={`rounded-xl p-8 border-2 transition ${
                    isRecommended
                      ? 'border-blue-500 bg-neutral-800/50'
                      : 'border-neutral-700 bg-neutral-800/30'
                  }`}
                >
                  {isRecommended && hasDiscount ? (
                    <div className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full mb-4">
                      BEST VALUE
                    </div>
                  ) : null}

                  <h3 className="text-2xl font-bold text-white mb-2">{sub.name}</h3>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">
                      {formatPrice(sub.total_price)}
                    </span>
                    <p className="text-neutral-400 text-sm mt-2">
                      {sub.name.toLowerCase().includes('month') ? 'per month' : 'per period'}
                    </p>
                  </div>

                  {cleanDescription && (
                    <p className="text-neutral-300 mb-6">{cleanDescription}</p>
                  )}

                  <ul className="space-y-3 mb-8">
                    {[
                      'Access to all current scripts',
                      'Access to all future scripts',
                      'Priority support',
                      'Early access to new features',
                      'Exclusive Discord channels',
                      'Script customization help',
                    ].map(f => (
                      <li key={f} className="flex items-center gap-3 text-neutral-300">
                        <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribeNow(sub)}
                    disabled={isAdding}
                    className={`w-full text-center px-6 py-3 font-semibold rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed ${
                      isRecommended
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-neutral-700 text-white hover:bg-neutral-600'
                    }`}
                  >
                    {isAdding ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Adding...
                      </span>
                    ) : 'Subscribe Now'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-neutral-400 text-lg mb-4">No subscriptions available at the moment.</p>
            <p className="text-neutral-500 text-sm">
              Check back soon or{' '}
              <Link href="/scripts" className="text-blue-400 hover:text-blue-300">
                browse our scripts
              </Link>
            </p>
          </div>
        )}

        {/* What's Included Section */}
        {scripts.length > 0 && (
          <section className="mt-20">
            {(() => {
              const totalValue = scripts.reduce((sum, s) => sum + s.total_price, 0);
              const monthlySub = subscriptions.find(s => s.name.toLowerCase().includes('month'));
              const monthsWorth = monthlySub && monthlySub.total_price > 0 ? Math.floor(totalValue / monthlySub.total_price) : 0;
              const years = Math.floor(monthsWorth / 12);
              const months = monthsWorth % 12;
              const worthLabel = years > 0 && months > 0
                ? `${years} Year${years !== 1 ? 's' : ''} ${months} Month${months !== 1 ? 's' : ''}`
                : years > 0
                ? `${years} Year${years !== 1 ? 's' : ''}`
                : `${months} Month${months !== 1 ? 's' : ''}`;
              return (
                <div className="flex flex-wrap justify-center gap-4 mb-14">
                  <div className="flex flex-col items-center bg-neutral-800/50 border border-neutral-700/50 rounded-2xl px-8 py-5 min-w-[150px]">
                    <span className="text-3xl font-black text-white mb-1">{scripts.length}</span>
                    <span className="text-neutral-500 text-sm font-medium">Products Included</span>
                  </div>
                  <div className="flex flex-col items-center bg-neutral-800/50 border border-neutral-700/50 rounded-2xl px-8 py-5 min-w-[150px]">
                    <span className="text-3xl font-black text-white mb-1">{formatPrice(totalValue)}</span>
                    <span className="text-neutral-500 text-sm font-medium">Total Value</span>
                  </div>
                  {monthsWorth > 0 && (
                    <div className="flex flex-col items-center bg-neutral-800/50 border border-neutral-700/50 rounded-2xl px-8 py-5 min-w-[150px]">
                      <span className="text-3xl font-black text-white mb-1">{worthLabel}</span>
                      <span className="text-neutral-500 text-sm font-medium">Worth of Subscriptions</span>
                    </div>
                  )}
                </div>
              );
            })()}

            <h2 className="text-4xl font-bold text-white text-center mb-3">{"What's Included"}</h2>
            <p className="text-neutral-500 text-center mb-12">
              Get all of our current scripts, plus new scripts on release day, automatically.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedScripts.map((script, idx) => (
                <Link
                  key={`${script.id}-${idx}`}
                  href={`/product/${script.id}`}
                  className="block bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-700 hover:border-blue-500/50 transition-all duration-500 group animate-fade-in"
                  style={{
                    animationDelay: `${idx * 100}ms`,
                    opacity: 0,
                    animation: 'fadeIn 0.5s ease forwards'
                  }}
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
                  <div className="flex gap-1.5 px-4 pt-4">
                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-red-500/15 text-red-400">QBCore</span>
                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-yellow-500/15 text-yellow-400">Qbox</span>
                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-orange-500/15 text-orange-400">ESX</span>
                  </div>
                  <div className="p-4 pt-2">
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition">{script.name}</h3>
                  </div>
                </Link>
              ))}

              <div className="bg-gradient-to-b from-neutral-700/50 to-transparent h-full rounded-2xl p-[1px] hidden lg:block">
                <div className="w-full h-full bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-2xl flex flex-col items-center justify-center min-h-[280px] gap-4">
                  <div className="text-blue-400 font-bold text-6xl leading-none" style={{ textShadow: '0 0 30px rgba(59,130,246,0.6)' }}>+</div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white/90">all current &</p>
                    <p className="text-xl font-bold text-white/90">future releases!</p>
                  </div>
                  <p className="text-neutral-500 text-sm text-center px-4">
                    {scripts.length} scripts and counting
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />

      {/* FiveM Login Modal */}
      {showLoginModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowLoginModal(false); }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-neutral-800">
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="text-xl font-bold text-white">Login with FiveM</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-neutral-400 hover:text-white transition p-1"
              >
                <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
            <div className="px-6 pb-6">
              <p className="text-neutral-300 mb-4 leading-relaxed">
                Before subscribing, we need you to log in with your Cfx.re/FiveM account so we know which Keymaster to send the assets to after checkout.
              </p>
              <p className="text-neutral-400 text-sm mb-6">
                Click the button below — it&apos;ll take just a couple of seconds!
              </p>
              {loginError && (
                <p className="mb-4 text-red-400 text-sm text-center">{loginError}</p>
              )}
              <div className="flex justify-center">
                <button
                  onClick={handleFiveMLogin}
                  disabled={loginLoading}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white transition"
                >
                  {loginLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 0C4.03 0 0 4.03 0 9C0 13.97 4.03 18 9 18C13.97 18 18 13.97 18 9C18 4.03 13.97 0 9 0ZM9 2.7C10.49 2.7 11.7 3.91 11.7 5.4C11.7 6.89 10.49 8.1 9 8.1C7.51 8.1 6.3 6.89 6.3 5.4C6.3 3.91 7.51 2.7 9 2.7ZM9 15.48C6.75 15.48 4.76 14.33 3.6 12.59C3.63 10.84 7.2 9.882 9 9.882C10.791 9.882 14.37 10.84 14.4 12.59C13.24 14.33 11.25 15.48 9 15.48Z" fill="currentColor"/>
                      </svg>
                      Login with FiveM
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
