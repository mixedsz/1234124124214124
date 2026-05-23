'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useBasket } from '@/hooks/use-basket';
import { formatPrice } from '@/lib/tebex';
import Link from 'next/link';
import { useState } from 'react';
import { Trash2, ArrowLeft, AlertCircle, ShoppingBag, LogIn } from 'lucide-react';

export default function CartPage() {
  const { basket, loading, removeItem, itemCount } = useBasket();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const handleCheckout = async () => {
    if (!basket) return;

    try {
      setProcessing(true);
      setError(null);

      if (basket.links?.checkout) {
        window.location.href = basket.links.checkout;
      } else {
        setError('Unable to access checkout. Please try again.');
      }
    } catch (err) {
      console.error('[CartPage] Checkout error:', err);
      setError('Failed to initiate checkout. Please try again.');
    } finally {
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
      <div className="min-h-screen bg-black flex flex-col">
        <Header basketCount={0} />
        <div className="flex items-center justify-center flex-1">
          <div className="text-neutral-400">Loading cart...</div>
        </div>
      </div>
    );
  }

  const packages = basket?.packages || [];
  const isCartEmpty = packages.length === 0;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header basketCount={itemCount} />

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
              {/* Login CTA */}
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
