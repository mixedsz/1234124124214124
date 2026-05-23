'use client';

import { Header } from '@/components/header';
import { getPackage, formatPrice } from '@/lib/tebex';
import { useEffect, useState } from 'react';
import { TebexPackage } from '@/lib/tebex';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, AlertCircle, Check } from 'lucide-react';
import { useBasket } from '@/hooks/use-basket';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [pkg, setPkg] = useState<TebexPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, basket, itemCount } = useBasket();

  useEffect(() => {
    const loadPackage = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const data = await getPackage(Number(resolvedParams.id));
        setPkg(data);
      } catch (err) {
        console.error('[ProductPage] Error:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadPackage();
  }, [params]);

  const handleAddToCart = async () => {
    if (!pkg || !basket) return;

    try {
      setAdding(true);
      setError(null);
      await addItem(pkg.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    } catch (err) {
      setError('Failed to add to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header basketCount={itemCount} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-neutral-400">Loading product...</div>
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-black">
        <Header basketCount={itemCount} />
        <div className="mx-auto max-w-7xl px-4 py-12">
          <Link
            href="/store"
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-8"
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

  const hasDiscount = pkg.discount > 0;

  return (
    <div className="min-h-screen bg-black">
      <Header basketCount={itemCount} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div>
            <div className="bg-neutral-900 rounded-xl aspect-square flex items-center justify-center overflow-hidden border border-neutral-800">
              {pkg.image ? (
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-orange-600/10">
                  <span className="text-6xl font-bold text-orange-500/50">{pkg.name.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{pkg.name}</h1>
                  <p className="text-neutral-400">{pkg.category?.name}</p>
                </div>
                {hasDiscount && (
                  <span className="bg-orange-500 text-white px-3 py-1 rounded text-sm font-bold">
                    SALE
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="mb-8 pb-8 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <span className="text-5xl font-bold text-orange-500">
                  {formatPrice(pkg.total_price, pkg.currency)}
                </span>
                {hasDiscount && (
                  <span className="text-2xl text-neutral-500 line-through">
                    {formatPrice(pkg.base_price, pkg.currency)}
                  </span>
                )}
              </div>
              <p className="text-neutral-500 text-sm mt-2">Tax included</p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <div 
                className="text-neutral-400 leading-relaxed prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: pkg.description }}
              />
            </div>

            {/* Add to Cart */}
            {error && (
              <div className="mb-6 bg-red-900/20 border border-red-900 rounded p-4 text-red-200 text-sm flex gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {added && (
              <div className="mb-6 bg-green-900/20 border border-green-900 rounded p-4 text-green-200 text-sm flex gap-2">
                <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Added to cart successfully!
              </div>
            )}

            <div className="space-y-4">
              {!pkg.disable_quantity && (
                <div className="flex items-center gap-4">
                  <label className="text-neutral-300 font-medium">Quantity:</label>
                  <div className="flex items-center border border-neutral-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 py-2 text-center bg-transparent text-white border-0 border-l border-r border-neutral-700 focus:outline-none"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-700 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {adding ? 'Adding to Cart...' : 'Add to Cart'}
              </button>

              <Link
                href="/cart"
                className="w-full block text-center border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white font-medium py-3 rounded-lg transition"
              >
                View Cart
              </Link>
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
