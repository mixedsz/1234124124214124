'use client';

import { Header } from '@/components/header';
import { useBasket } from '@/hooks/use-basket';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Trash2, ArrowLeft, AlertCircle } from 'lucide-react';

export default function CartPage() {
  const { basket, loading, removeItem, updateUsername } = useBasket();
  const [username, setUsername] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
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

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-slate-400">Loading cart...</div>
        </div>
      </div>
    );
  }

  const isCartEmpty = !basket || basket.items.length === 0;

  return (
    <div className="min-h-screen bg-slate-950">
      <Header basketItemCount={basket?.items.length || 0} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8"
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
              <div className="bg-slate-900 rounded-lg border border-slate-800 p-12 text-center">
                <p className="text-slate-400 mb-4">Your cart is empty</p>
                <Link
                  href="/store"
                  className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {basket!.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-900 rounded-lg border border-slate-800 p-6 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                      <p className="text-slate-400 text-sm">
                        Quantity: <span className="font-medium">{item.quantity}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-400">
                          ${item.price.toFixed(2)}
                        </p>
                        <p className="text-slate-400 text-sm">
                          ${(item.price * item.quantity).toFixed(2)} total
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 hover:bg-red-900/20 rounded transition text-red-400 hover:text-red-300"
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
            <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 space-y-6 sticky top-24">
              {/* Username Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Minecraft Username</h3>
                <div className="space-y-3">
                  {!username ? (
                    <>
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder="Enter your username"
                        className="w-full bg-slate-800 text-white px-4 py-3 rounded border border-slate-700 placeholder-slate-500 focus:border-blue-600 focus:outline-none transition"
                      />
                      <button
                        onClick={handleUpdateUsername}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
                      >
                        Set Username
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="bg-slate-800 px-4 py-3 rounded border border-slate-700 text-white font-medium">
                        {username}
                      </div>
                      <button
                        onClick={() => {
                          setUsername('');
                          setUsernameInput('');
                        }}
                        className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        Change Username
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>${basket?.complete_price.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4 flex justify-between mb-6">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-2xl font-bold text-blue-400">
                    ${basket?.complete_price.toFixed(2) || '0.00'}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCartEmpty || !username || processing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-semibold py-3 rounded transition"
                >
                  {processing ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                <p className="text-xs text-slate-500 text-center mt-4">
                  Secure checkout powered by Tebex
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="mx-auto max-w-7xl text-center text-slate-400">
          <p>© 2024 FiveM Store. All rights reserved. Powered by Tebex.</p>
        </div>
      </footer>
    </div>
  );
}
