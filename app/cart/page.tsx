'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useBasket } from '@/contexts/basket-context';
import { TEBEX_PROJECT_ID } from '@/lib/tebex';
import { useCurrency } from '@/contexts/currency-context';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Trash2, ArrowLeft, AlertCircle, LogIn, X, Lock, Gift, TrendingUp } from 'lucide-react';

// Declare Tebex global
declare global {
  interface Window {
    Tebex?: {
      checkout: {
        init: (config: { ident: string; theme?: string; colors?: { name: string; color: string }[] }) => void;
        launch: () => void;
        on: (event: string, callback: (data?: unknown) => void) => void;
        close: () => void;
      };
    };
  }
}

export default function CartPage() {
  useEffect(() => { document.title = 'Cart | Flake Development | QBCore, Qbox & ESX FiveM Scripts'; }, []);

  const { basket, loading, removeItem, itemCount, isAuthenticated, refreshBasket } = useBasket();
  const { formatPrice } = useCurrency();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [upsellProducts, setUpsellProducts] = useState<Array<{ id: number; name: string; image?: string; base_price: number; total_price: number; discount: number; currency: string }>>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [discordLinked, setDiscordLinked] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!basket?.username) { setAvatarUrl(null); return; }
    fetch(`/api/fivem-avatar?username=${encodeURIComponent(basket.username)}`)
      .then((r) => r.json())
      .then((d) => setAvatarUrl(d.url || null))
      .catch(() => setAvatarUrl(null));
  }, [basket?.username]);

  // Coupon state
  const [couponType, setCouponType] = useState<'coupon' | 'creator_code'>('coupon');
  const [couponTypeOpen, setCouponTypeOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Gift card state
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardError, setGiftCardError] = useState<string | null>(null);
  const [giftCardSuccess, setGiftCardSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/upsell-products')
      .then(r => r.json())
      .then(data => {
        const cartIds = new Set((basket?.packages || []).map((p) => p.id));
        setUpsellProducts(data.filter((p: { id: number }) => !cartIds.has(p.id)).slice(0, 4));
      })
      .catch(() => {});
  }, [basket?.packages]);

  // Restore Discord linked state from localStorage or Tebex ident return param
  useEffect(() => {
    if (!basket?.ident) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('discord_linked') === '1') {
      setDiscordLinked(true);
      localStorage.setItem('discord_linked_basket', basket.ident);
      refreshBasket();
      const url = new URL(window.location.href);
      url.searchParams.delete('discord_linked');
      window.history.replaceState({}, '', url.toString());
    } else if (localStorage.getItem('discord_linked_basket') === basket.ident) {
      setDiscordLinked(true);
    }
  }, [basket?.ident, refreshBasket]);

  // Initialize Tebex checkout when needed
  const initTebexCheckout = useCallback(() => {
    if (!basket?.ident || !window.Tebex) {
      console.error('[Cart] Tebex.js not loaded or no basket ident');
      return false;
    }

    try {
      // Initialize Tebex checkout with basket ident
      const lang = typeof localStorage !== 'undefined' ? localStorage.getItem('tebex_language') : null;
      window.Tebex.checkout.init({
        ident: basket.ident,
        theme: 'dark',
        colors: [{ name: 'primary', color: '#3B82F6' }],
        ...(lang ? { locale: lang } : {}),
      } as Parameters<typeof window.Tebex.checkout.init>[0]);

      // Listen for checkout events
      window.Tebex.checkout.on('payment:complete', () => {
        console.log('[Cart] Payment complete');
        setShowCheckout(false);
        // Redirect to success page
        window.location.href = '/checkout-complete?success=true';
      });

      window.Tebex.checkout.on('payment:error', (data) => {
        console.error('[Cart] Payment error:', data);
        setError('Payment failed. Please try again.');
        setShowCheckout(false);
      });

      window.Tebex.checkout.on('close', () => {
        console.log('[Cart] Checkout closed');
        setShowCheckout(false);
        setProcessing(false);
      });

      return true;
    } catch (err) {
      console.error('[Cart] Error initializing Tebex checkout:', err);
      return false;
    }
  }, [basket?.ident]);

  const handleCheckout = async () => {
    if (!basket) return;

    try {
      setProcessing(true);
      setError(null);

      // Check if Tebex.js is loaded
      if (window.Tebex) {
        // Use Tebex.js popup checkout
        if (initTebexCheckout()) {
          setShowCheckout(true);
          window.Tebex.checkout.launch();
        } else {
          // Fallback to redirect checkout
          if (basket.links?.checkout) {
            window.location.href = basket.links.checkout;
          } else {
            // Direct checkout URL
            window.location.href = `https://pay.tebex.io/${basket.ident}`;
          }
        }
      } else {
        // Fallback to redirect checkout if Tebex.js not loaded
        if (basket.links?.checkout) {
          window.location.href = basket.links.checkout;
        } else {
          window.location.href = `https://pay.tebex.io/${basket.ident}`;
        }
      }
    } catch (err) {
      console.error('[CartPage] Checkout error:', err);
      setError('Failed to initiate checkout. Please try again.');
      setProcessing(false);
    }
  };

  const handleRemoveItem = async (packageId: number) => {
    try {
      setRemovingId(packageId);
      setError(null);
      await removeItem(packageId);
    } catch {
      setError('Failed to remove item');
    } finally {
      setRemovingId(null);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim() || !basket) return;
    setCouponError(null);
    setCouponSuccess(null);
    try {
      const res = await fetch(`/api/tebex/coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ident: basket.ident, code: couponCode.trim(), type: couponType }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setCouponError(data.error || 'Invalid code');
      } else {
        setCouponSuccess('Code applied!');
        await refreshBasket();
      }
    } catch {
      setCouponError('Failed to apply code');
    }
  };

  const handleApplyGiftCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCardCode.trim() || !basket) return;
    setGiftCardError(null);
    setGiftCardSuccess(null);
    try {
      const res = await fetch(`/api/tebex/giftcard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ident: basket.ident, code: giftCardCode.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setGiftCardError(data.error || 'Invalid gift card');
      } else {
        setGiftCardSuccess('Gift card applied!');
        await refreshBasket();
      }
    } catch {
      setGiftCardError('Failed to apply gift card');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col">
        <Header />
        <div className="flex items-center justify-center flex-1">
          <div className="text-neutral-400">Loading cart...</div>
        </div>
      </div>
    );
  }

  const packages = basket?.packages || [];
  const isCartEmpty = packages.length === 0;

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col overflow-x-hidden w-full max-w-full">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
        <div className="flex justify-between items-end mb-8">
          <h1 className="text-3xl sm:text-[40px] font-bold text-white leading-none">Cart</h1>
          <p className="text-neutral-600 font-medium text-sm">{(basket?.packages || []).length} package{(basket?.packages || []).length !== 1 ? 's' : ''}</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-900 rounded-xl p-4 text-red-300 flex gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Cart Items + Subscribe & Save */}
          <div className="lg:col-span-2">
            {isCartEmpty ? (
              <div>
                <p className="text-neutral-500">Your basket is empty. Your players are missing out on the ultimate FiveM experience.</p>
                <Link
                  href="/scripts"
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 font-semibold transition"
                >
                  Browse Scripts
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6l-6 6"/></svg>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {packages.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-950 rounded-xl border border-neutral-800 p-5"
                  >
                    <div className="flex items-start gap-4">
                      {/* Product image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-blue-600/10">
                            <span className="text-xl font-bold text-blue-500/50">{item.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-lg text-white leading-tight">{item.name}</h3>
                          <p className="text-xl font-bold text-white flex-shrink-0">
                            {formatPrice(item.in_basket.price)}
                          </p>
                        </div>

                        {/* FiveM row */}
                        <div className="flex items-center gap-1.5 mt-2">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={basket?.username ?? ''} className="w-4 h-4 rounded object-cover flex-shrink-0" onError={() => setAvatarUrl(null)} />
                          ) : (
                            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 48 48" fill="#F97316" xmlns="http://www.w3.org/2000/svg">
                              <polygon points="5,45 9,34 21,22 15,45"/>
                              <polygon points="25,18 33,45 43,45 32,12"/>
                              <polygon points="16.059,14.164 20,3 28,3"/>
                              <polygon points="10.731,29.002 23,17 23,15 11.58,26.667"/>
                              <polygon points="15.142,16.429 13,22 29.724,5.725 28.818,3.178"/>
                              <polygon points="23.932,14.055 24.377,15.626 30.941,9.178 30.385,7.702"/>
                            </svg>
                          )}
                          <span className="text-neutral-500 text-xs">FiveM:</span>
                          <span className="text-white text-xs">{basket?.username || 'Not linked'}</span>
                        </div>

                        {/* Discord row */}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <svg className="w-4 h-4 text-[#5865F2] flex-shrink-0" viewBox="0 0 71 55" fill="currentColor">
                            <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.44077 45.4204 0.52529C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.52529C25.5141 0.44359 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"/>
                          </svg>
                          <span className="text-neutral-500 text-xs">Discord:</span>
                          {discordLinked ? (
                            <span className="text-indigo-300 text-xs font-semibold">Connected</span>
                          ) : (
                            <a
                              href={basket && typeof window !== 'undefined'
                                ? `https://ident.tebex.io/discord/?basketIdent=${basket.ident}&return=${encodeURIComponent(`${window.location.origin}/api/discord/ident-callback?basketIdent=${basket.ident}&returnTo=/cart`)}`
                                : '#'}
                              className="text-blue-400 text-xs font-semibold hover:text-blue-300 transition"
                            >
                              Connect
                            </a>
                          )}
                        </div>

                        {/* Gifting to row — shown only for gift purchases */}
                        {(item.in_basket.gift_username || item.in_basket.gift_username_id) && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Gift className="w-[15px] h-[15px] text-blue-400 flex-shrink-0" />
                            <span className="text-neutral-500 text-xs">Gifting to:</span>
                            <span className="text-white text-xs font-semibold">
                              {item.in_basket.gift_username || `#${item.in_basket.gift_username_id}`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removingId === item.id}
                        className="p-2 hover:bg-red-900/20 rounded-lg transition text-neutral-500 hover:text-red-400 disabled:opacity-50 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Subscribe & Save section */}
            <div className="mt-10 lg:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* FD+ badge graphic */}
              <div className="flex-shrink-0 w-[80px] sm:w-[90px] lg:w-[120px] h-[55px] sm:h-[60px] lg:h-[80px] rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-blue-400 font-black text-xl sm:text-2xl lg:text-3xl tracking-tight leading-none">FD</div>
                  <div className="text-blue-300 font-black text-base sm:text-lg lg:text-xl leading-none">+</div>
                </div>
              </div>
              {/* Text + CTA */}
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-extrabold text-white mb-2">Subscribe &amp; Save with Flake+</h2>
                <p className="text-sm text-neutral-500 mb-4">
                  Get our entire collection, including new scripts on release day, for one low monthly price.{' '}
                  <strong className="text-white">Save up to 85%</strong> when compared to the usual upfront cost; with no price increases while you remain subscribed.
                </p>
                <Link
                  href="/subscription"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 text-sm font-semibold transition"
                >
                  Learn More
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4 sticky top-24">
              {/* Apply Coupon card */}
              <div className="bg-neutral-900/80 rounded-2xl border border-neutral-800 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <path d="M15 5l0 2"/><path d="M15 11l0 2"/><path d="M15 17l0 2"/><path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2"/>
                  </svg>
                  <h3 className="font-semibold text-white">Apply Coupon</h3>
                </div>
                <form onSubmit={handleApplyCoupon}>
                  <div className="flex h-9">
                    {/* Custom dropdown for coupon type */}
                    <div className="relative w-[100px] sm:w-[120px] flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setCouponTypeOpen(!couponTypeOpen)}
                        className="w-full h-full flex items-center justify-between gap-1 bg-neutral-800 border border-neutral-700 border-r-0 rounded-l-lg px-3 text-white text-xs focus:outline-none hover:bg-neutral-750 transition"
                      >
                        <span>{couponType === 'coupon' ? 'Coupon' : 'Creator Code'}</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className={`text-neutral-400 transition-transform ${couponTypeOpen ? 'rotate-180' : ''}`}
                        >
                          <path d="M6 9l6 6l6 -6"/>
                        </svg>
                      </button>
                      {couponTypeOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setCouponTypeOpen(false)} />
                          <div className="absolute top-full left-0 mt-1 w-full bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-50 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => { setCouponType('coupon'); setCouponTypeOpen(false); }}
                              className={`w-full px-3 py-2 text-left text-xs transition ${couponType === 'coupon' ? 'bg-blue-600/20 text-blue-400' : 'text-white hover:bg-neutral-700'}`}
                            >
                              Coupon
                            </button>
                            <button
                              type="button"
                              onClick={() => { setCouponType('creator_code'); setCouponTypeOpen(false); }}
                              className={`w-full px-3 py-2 text-left text-xs transition ${couponType === 'creator_code' ? 'bg-blue-600/20 text-blue-400' : 'text-white hover:bg-neutral-700'}`}
                            >
                              Creator Code
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 bg-neutral-800 border border-neutral-700 px-3 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-blue-500 min-w-0"
                    />
                    <button
                      type="submit"
                      className="px-3 bg-blue-600/20 hover:bg-blue-600/35 border border-neutral-700 border-l-0 rounded-r-lg text-blue-400 text-xs font-semibold transition flex-shrink-0 flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5l10 -10"/></svg>
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-red-400 text-xs mt-2">{couponError}</p>}
                  {couponSuccess && <p className="text-green-400 text-xs mt-2">{couponSuccess}</p>}
                </form>
              </div>

              {/* Gift Card card */}
              <div className="bg-neutral-900/80 rounded-2xl border border-neutral-800 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <path d="M3 8m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1z"/><path d="M12 8l0 13"/><path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5"/>
                  </svg>
                  <h3 className="font-semibold text-white">Gift Card</h3>
                </div>
                <form onSubmit={handleApplyGiftCard}>
                  <div className="flex h-9">
                    <input
                      type="text"
                      value={giftCardCode}
                      onChange={(e) => setGiftCardCode(e.target.value)}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-l-lg px-3 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-blue-500 min-w-0 tracking-widest"
                    />
                    <button
                      type="submit"
                      className="px-3 bg-blue-600/20 hover:bg-blue-600/35 border border-neutral-700 border-l-0 rounded-r-lg text-blue-400 text-xs font-semibold transition flex-shrink-0 flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5l10 -10"/></svg>
                      Apply
                    </button>
                  </div>
                  {giftCardError && <p className="text-red-400 text-xs mt-2">{giftCardError}</p>}
                  {giftCardSuccess && <p className="text-green-400 text-xs mt-2">{giftCardSuccess}</p>}
                </form>
              </div>

              {/* Cart Summary card */}
              <div className="bg-neutral-900/80 rounded-2xl border border-neutral-800 p-6">
                <h3 className="font-extrabold text-white text-lg mb-5">Cart Summary</h3>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-neutral-400 text-sm">
                    <span>Sub total</span>
                    <span>{formatPrice(basket?.base_price || 0)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 text-sm">
                    <span>Sales Tax</span>
                    <span>
                      {(basket?.sales_tax || 0) === 0
                        ? 'Free'
                        : formatPrice(basket?.sales_tax || 0)}
                    </span>
                  </div>
                  <div className="border-t border-neutral-800 pt-3 flex justify-between">
                    <span className="font-bold text-white">Total Price</span>
                    <span className="text-xl font-bold text-white">
                      {formatPrice(basket?.total_price || 0)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCartEmpty || processing || !isAuthenticated}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {!isAuthenticated
                    ? 'Login to Checkout'
                    : processing
                    ? 'Processing...'
                    : 'Secure Checkout'}
                </button>

                {/* Payment methods image */}
                <div className="flex justify-center mt-5 mb-3">
                  <img src="/we-accept.svg" alt="Payment methods we accept" width="200" height="32" className="opacity-80" />
                </div>

                {/* Cash App */}
                <div className="flex justify-center mb-3">
                  <img src="/cashapp-logo.svg" alt="Cash App" width="110" height="30" className="opacity-85" />
                </div>

                {/* Powered by Tebex */}
                <div className="flex justify-center items-center gap-2 mb-2">
                  <span className="text-neutral-600 text-sm font-medium">Powered by</span>
                  <img src="/tebex-logo.svg" alt="Tebex" width="64" height="20" className="opacity-40 mt-[-2px]" />
                </div>
                <p className="text-xs text-neutral-600 text-center">
                  Our checkout process is owned &amp; operated by Tebex Limited, who handle product fulfilment, billing support and refunds.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Upsell: You Might Also Like */}
        {upsellProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-neutral-800">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">You Might Also Like</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {upsellProducts.map(pkg => {
                const price = pkg.discount > 0 ? Math.max(0, pkg.base_price - pkg.discount) : pkg.total_price;
                return (
                  <Link
                    key={pkg.id}
                    href={`/product/${pkg.id}`}
                    className="group bg-neutral-900 rounded-xl border border-neutral-800 hover:border-blue-500/50 overflow-hidden transition-all duration-200"
                  >
                    <div className="aspect-video bg-neutral-800 overflow-hidden">
                      {pkg.image ? (
                        <img
                          src={pkg.image}
                          alt={pkg.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-blue-500/40">{pkg.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-white text-xs font-semibold line-clamp-1 group-hover:text-blue-400 transition-colors">{pkg.name}</p>
                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-blue-400 text-sm font-bold">
                          {price === 0 ? 'Free' : formatPrice(price)}
                        </span>
                        {pkg.discount > 0 && (
                          <span className="text-neutral-600 text-xs line-through">{formatPrice(pkg.base_price)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
