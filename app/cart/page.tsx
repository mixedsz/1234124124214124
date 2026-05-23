'use client';

import { Header } from '@/components/header';
import { useBasket } from '@/hooks/use-basket';
import { formatPrice } from '@/lib/tebex';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Trash2, ArrowLeft, AlertCircle, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { basket, loading, removeItem, updateUsername, itemCount } = useBasket();
  const [username, setUsername] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('tebex_username');
    if (stored) {
      setUsername(stored);
      setUsernameInput(stored);
    }
  }, []);

  const handleUpdateUsername = async () => {
    if (!usernameInput.trim()) {
      setError('Please enter a username');
      return;
    }

    try {
      setError(null);
      await updateUsername(usernameInput);
      setUsername(usernameInput);
    } catch {
      setError('Failed to update username');
    }
  };

  const handleCheckout = async () => {
    if (!basket || !username) {
      setError('Please set a username before checkout');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      // Use the checkout URL from the basket
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
      <div className="min-h-screen bg-black">
        <Header basketCount={itemCount} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-neutral-400">Loading cart...</div>
        </div>
      </div>
    );
  }

  const packages = basket?.packages || [];
  const isCartEmpty = packages.length === 0;

  return (
    <div className="min-h-screen bg-black">
      <Header basketCount={itemCount} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Shopping Cart</h1>

        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-900 rounded-lg p-4 text-red-200 flex gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {isCartEmpty ? (
              <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-400 mb-4">Your cart is empty</p>
                <Link
                  href="/store"
                  className="inline-block px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition font-medium"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {packages.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 flex items-center gap-4"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-orange-600/10">
                          <span className="text-xl font-bold text-orange-500/50">{item.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate">{item.name}</h3>
                      <p className="text-neutral-400 text-sm">
                        Qty: <span className="font-medium">{item.in_basket.quantity}</span>
                      </p>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xl font-bold text-orange-500">
                          {formatPrice(item.in_basket.price, basket?.currency || 'USD')}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removingId === item.id}
                        className="p-2 hover:bg-red-900/20 rounded-lg transition text-red-400 hover:text-red-300 disabled:opacity-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 space-y-6 sticky top-24">
              {/* Username Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Your Username</h3>
                <div className="space-y-3">
                  {!username ? (
                    <>
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder="Enter your username"
                        className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 placeholder-neutral-500 focus:border-orange-500 focus:outline-none transition"
                      />
                      <button
                        onClick={handleUpdateUsername}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition"
                      >
                        Set Username
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="bg-neutral-800 px-4 py-3 rounded-lg border border-neutral-700 text-white font-medium">
                        {username}
                      </div>
                      <button
                        onClick={() => {
                          setUsername('');
                          setUsernameInput('');
                          localStorage.removeItem('tebex_username');
                        }}
                        className="w-full text-orange-400 hover:text-orange-300 text-sm font-medium"
                      >
                        Change Username
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-neutral-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(basket?.base_price || 0, basket?.currency || 'USD')}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Tax</span>
                    <span>{formatPrice(basket?.sales_tax || 0, basket?.currency || 'USD')}</span>
                  </div>
                </div>

                <div className="border-t border-neutral-700 pt-4 flex justify-between mb-6">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-2xl font-bold text-orange-500">
                    {formatPrice(basket?.total_price || 0, basket?.currency || 'USD')}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCartEmpty || !username || processing}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-semibold py-3 rounded-lg transition"
                >
                  {processing ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                <p className="text-xs text-neutral-500 text-center mt-4">
                  Secure checkout powered by Tebex
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-black py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="mx-auto max-w-7xl text-center text-neutral-400">
          <p>Powered by Tebex</p>
        </div>
      </footer>
    </div>
  );
}
