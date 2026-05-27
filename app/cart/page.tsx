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
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex justify-between items-end mb-8">
          <h1 className="text-[40px] font-bold text-white leading-none">Cart</h1>
          <p className="text-neutral-600 font-medium text-sm">{(basket?.packages || []).length} package{(basket?.packages || []).length !== 1 ? 's' : ''}</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-900 rounded-xl p-4 text-red-300 flex gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
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
                          <div className="w-4 h-4 rounded bg-red-600 overflow-hidden flex items-center justify-center flex-shrink-0">
                            {avatarUrl ? (
                              <img src={avatarUrl} alt={basket?.username ?? ''} className="w-full h-full object-cover" onError={() => setAvatarUrl(null)} />
                            ) : (
                              <span className="text-white font-bold text-[9px] leading-none">M</span>
                            )}
                          </div>
                          <span className="text-neutral-500 text-xs">FiveM:</span>
                          <span className="text-white text-xs">{basket?.username || 'Not linked'}</span>
                        </div>

                        {/* Discord row */}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-400 flex-shrink-0">
                            <path d="M14.983 3l.123 .006c2.014 .214 3.527 .672 4.966 1.673a1 1 0 0 1 .371 .488c1.876 5.315 2.373 9.987 1.451 12.28c-1.003 2.005 -2.606 3.553 -4.394 3.553c-.732 0 -1.693 -.968 -2.328 -2.045a21.512 21.512 0 0 0 2.103 -.493a1 1 0 1 0 -.55 -1.924c-3.32 .95 -6.13 .95 -9.45 0a1 1 0 0 0 -.55 1.924c.717 .204 1.416 .37 2.103 .494c-.635 1.075 -1.596 2.044 -2.328 2.044c-1.788 0 -3.391 -1.548 -4.428 -3.629c-.888 -2.217 -.39 -6.89 1.485 -12.204a1 1 0 0 1 .371 -.488c1.439 -1.001 2.952 -1.459 4.966 -1.673a1 1 0 0 1 .935 .435l.063 .107l.651 1.285l.137 -.016a12.97 12.97 0 0 1 2.643 0l.134 .016l.65 -1.284a1 1 0 0 1 .754 -.54l.122 -.009zm-5.983 7a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15zm6 0a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15z"/>
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
            <div className="mt-10 lg:mt-16 flex items-start lg:items-center gap-6">
              {/* FD+ badge graphic */}
              <div className="flex-shrink-0 w-[90px] lg:w-[120px] h-[60px] lg:h-[80px] rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-blue-400 font-black text-2xl lg:text-3xl tracking-tight leading-none">FD</div>
                  <div className="text-blue-300 font-black text-lg lg:text-xl leading-none">+</div>
                </div>
              </div>
              {/* Text + CTA */}
              <div>
                <h2 className="text-xl font-extrabold text-white mb-2">Subscribe &amp; Save with Flake+</h2>
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
                    <select
                      value={couponType}
                      onChange={(e) => setCouponType(e.target.value as 'coupon' | 'creator_code')}
                      className="w-[110px] flex-shrink-0 bg-neutral-800 border border-neutral-700 border-r-0 rounded-l-lg px-2 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="coupon">Coupon</option>
                      <option value="creator_code">Creator Code</option>
                    </select>
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
                    className="group bg-neutral-950 rounded-xl border border-neutral-800 hover:border-blue-500/50 overflow-hidden transition-all duration-200"
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
