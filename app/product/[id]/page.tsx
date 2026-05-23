'use client';

import { Header } from '@/components/header';
import { getPackage } from '@/lib/tebex';
import { useEffect, useState } from 'react';
import { TebexPackage } from '@/lib/tebex';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, AlertCircle } from 'lucide-react';
import { useBasket } from '@/hooks/use-basket';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [pkg, setPkg] = useState<TebexPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addItem, basket } = useBasket();

  useEffect(() => {
    const loadPackage = async () => {
      try {
        setLoading(true);
        const data = await getPackage(Number(params.id));
        setPkg(data);
      } catch (err) {
        console.error('[ProductPage] Error:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadPackage();
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!pkg || !basket) return;

    try {
      setAdding(true);
      await addItem(pkg.id, quantity);
      alert('Product added to cart!');
    } catch (err) {
      setError('Failed to add to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-slate-400">Loading product...</div>
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-12">
          <Link
            href="/store"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
          <div className="bg-red-900/20 border border-red-900 rounded-lg p-8 text-red-200">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Product Not Found</h3>
                <p>{error || 'The product you are looking for does not exist.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-lg aspect-square flex items-center justify-center overflow-hidden">
              {pkg.image ? (
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-slate-400">No image available</div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{pkg.name}</h1>
                  <p className="text-slate-400">{pkg.category.name}</p>
                </div>
                {pkg.quantity > 0 ? (
                  <span className="bg-green-900/30 text-green-300 px-3 py-1 rounded">
                    In Stock
                  </span>
                ) : (
                  <span className="bg-red-900/30 text-red-300 px-3 py-1 rounded">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="mb-8 pb-8 border-b border-slate-800">
              <div className="text-5xl font-bold text-blue-400 mb-2">
                ${pkg.price.toFixed(2)}
              </div>
              {pkg.expireHours && (
                <p className="text-slate-400 text-sm">
                  Valid for {pkg.expireHours} hours after purchase
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <p className="text-slate-400 leading-relaxed">
                {pkg.description}
              </p>
            </div>

            {/* Add to Cart */}
            {error && (
              <div className="mb-6 bg-red-900/20 border border-red-900 rounded p-4 text-red-200 text-sm flex gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {pkg.quantity > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-slate-300 font-medium">Quantity:</label>
                  <div className="flex items-center border border-slate-700 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-slate-400 hover:text-white transition"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 py-2 text-center bg-transparent text-white border-0 border-l border-r border-slate-700"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-slate-400 hover:text-white transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {adding ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
              </div>
            ) : (
              <button
                disabled
                className="w-full bg-slate-700 text-slate-400 font-semibold py-4 rounded-lg cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-slate-800 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Availability</span>
                <span className="text-white font-medium">{pkg.quantity} in stock</span>
              </div>
              {pkg.global && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Global</span>
                  <span className="text-green-400 font-medium">Yes</span>
                </div>
              )}
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
