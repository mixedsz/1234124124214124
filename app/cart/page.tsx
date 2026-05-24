'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useBasket } from '@/contexts/basket-context';
import { TEBEX_PROJECT_ID } from '@/lib/tebex';
import { useCurrency } from '@/contexts/currency-context';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Trash2, ArrowLeft, AlertCircle, ShoppingBag, LogIn, X, Lock } from 'lucide-react';

// Declare Tebex global
declare global {
  interface Window {
    Tebex?: {
      checkout: {
        init: (config: { ident: string }) => void;
        launch: () => void;
        on: (event: string, callback: (data?: unknown) => void) => void;
        close: () => void;
      };
    };
  }
}

export default function CartPage() {
  const { basket, loading, removeItem, itemCount, isAuthenticated, refreshBasket } = useBasket();
  const { formatPrice } = useCurrency();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [discordLinked, setDiscordLinked] = useState(false);

  // Coupon state
  const [couponType, setCouponType] = useState<'coupon' | 'creator_code'>('coupon');
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Gift card state
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardError, setGiftCardError] = useState<string | null>(null);
  const [giftCardSuccess, setGiftCardSuccess] = useState<string | null>(null);

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
      window.Tebex.checkout.init({
        ident: basket.ident,
      });

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
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Shopping Cart</h1>

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
              <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-16 text-center">
                <ShoppingBag className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
                <p className="text-neutral-400 text-lg mb-2">Your cart is empty</p>
                <p className="text-neutral-600 text-sm mb-6">Add some scripts to get started</p>
                <Link
                  href="/store"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition font-semibold"
                >
                  Browse Scripts
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
                          <span className="inline-flex items-center justify-center w-4 h-4 bg-red-600 rounded text-white font-bold text-[9px] leading-none flex-shrink-0">
                            M
                          </span>
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
            <div className="mt-8 bg-neutral-950 rounded-2xl border border-neutral-800 p-6">
              <h2 className="text-xl font-extrabold text-white mb-2">Subscribe &amp; Save with Flake+</h2>
              <p className="text-sm text-neutral-400 mb-4">
                Get our entire collection, including new scripts on release day, for one low monthly price.{' '}
                <strong className="text-white">Save up to 85%</strong> when compared to the usual upfront cost; with no price increases while you remain subscribed.
              </p>
              <Link
                href="/subscription"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 text-sm font-semibold transition"
              >
                <span>Learn More</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4 sticky top-24">
              {/* Apply Coupon card */}
              <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
                    <path d="M15 5l0 2"/><path d="M15 11l0 2"/><path d="M15 17l0 2"/><path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2"/>
                  </svg>
                  <h3 className="font-semibold text-white">Apply Coupon</h3>
                </div>
                <form onSubmit={handleApplyCoupon} className="space-y-3">
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as 'coupon' | 'creator_code')}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="coupon">Coupon</option>
                    <option value="creator_code">Creator Code</option>
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition flex-shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-red-400 text-xs">{couponError}</p>}
                  {couponSuccess && <p className="text-green-400 text-xs">{couponSuccess}</p>}
                </form>
              </div>

              {/* Gift Card card */}
              <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
                    <path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9z"/><path d="M8 7a2 2 0 1 1 4 0"/><path d="M12 7a2 2 0 1 1 4 0"/><path d="M12 7v13"/><path d="M3 13h18"/>
                  </svg>
                  <h3 className="font-semibold text-white">Gift Card</h3>
                </div>
                <form onSubmit={handleApplyGiftCard} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={giftCardCode}
                      onChange={(e) => setGiftCardCode(e.target.value)}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition flex-shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                  {giftCardError && <p className="text-red-400 text-xs">{giftCardError}</p>}
                  {giftCardSuccess && <p className="text-green-400 text-xs">{giftCardSuccess}</p>}
                </form>
              </div>

              {/* Cart Summary card */}
              <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6">
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
                <div className="flex justify-center my-5">
                  <img src="/we-accept.svg" alt="Payment methods we accept" width="280" className="opacity-80" />
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
      </main>

      <Footer />
    </div>
  );
}
