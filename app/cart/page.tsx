'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useBasket } from '@/contexts/basket-context';
import { formatPrice, TEBEX_PROJECT_ID } from '@/lib/tebex';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Trash2, ArrowLeft, AlertCircle, ShoppingBag, LogIn, X } from 'lucide-react';

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
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

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
          {/* Cart Items */}
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
                    className="bg-neutral-950 rounded-xl border border-neutral-800 p-5 flex items-center gap-4"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-blue-600/10">
                          <span className="text-xl font-bold text-blue-500/50">{item.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-white truncate">{item.name}</h3>
                      <p className="text-neutral-500 text-sm mt-0.5">Qty: {item.in_basket.quantity}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-xl font-bold text-blue-400">
                        {formatPrice(item.in_basket.price, basket?.currency || 'USD')}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removingId === item.id}
                        className="p-2 hover:bg-red-900/20 rounded-lg transition text-neutral-500 hover:text-red-400 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 space-y-6 sticky top-24">
              {/* Login CTA - Only show if not authenticated */}
              {!isAuthenticated && (
                <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-4">
                  <p className="text-sm text-blue-300 font-medium mb-3">
                    Sign in to link your purchase to your FiveM account
                  </p>
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition"
                  >
                    <LogIn className="w-4 h-4" />
                    Login with FiveM
                  </Link>
                </div>
              )}

              {/* Authenticated user badge */}
              {isAuthenticated && basket?.username && (
                <div className="bg-green-600/10 border border-green-600/20 rounded-xl p-4">
                  <p className="text-sm text-green-300 font-medium">
                    Logged in as <span className="font-bold">{basket.username}</span>
                  </p>
                </div>
              )}

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-neutral-400 text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(basket?.base_price || 0, basket?.currency || 'USD')}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 text-sm">
                    <span>Tax</span>
                    <span>{formatPrice(basket?.sales_tax || 0, basket?.currency || 'USD')}</span>
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-4 flex justify-between mb-6">
                  <span className="font-semibold text-white">Total</span>
                  <span className="text-2xl font-bold text-blue-400">
                    {formatPrice(basket?.total_price || 0, basket?.currency || 'USD')}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCartEmpty || processing}
                  className="w-full bg-white hover:bg-neutral-100 disabled:bg-neutral-800 disabled:text-neutral-600 text-black font-bold py-3 rounded-xl transition"
                >
                  {processing ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                <p className="text-xs text-neutral-600 text-center mt-4">
                  Secure checkout powered by Tebex
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
