'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
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
  const { addItem, itemCount } = useBasket();

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
    if (!pkg) return;

    try {
      setAdding(true);
      setError(null);
      await addItem(pkg.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    } catch {
      setError('Failed to add to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col">
        <Header basketCount={itemCount} />
        <div className="flex items-center justify-center flex-1">
          <div className="text-neutral-400">Loading product...</div>
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col">
        <Header basketCount={itemCount} />
        <div className="mx-auto max-w-7xl px-4 py-12 w-full">
          <Link href="/store" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <div className="bg-red-900/20 border border-red-900 rounded-xl p-8 text-red-200">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Product Not Found</h3>
                <p>{error || 'The product you are looking for does not exist.'}</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const hasDiscount = pkg.discount > 0;

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <Header basketCount={itemCount} />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link href="/store" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-10 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div>
            <div className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 aspect-video">
              {pkg.image ? (
                <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-blue-600/10">
                  <span className="text-6xl font-bold text-blue-500/50">{pkg.name.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-blue-400 text-sm font-medium mb-2">{pkg.category?.name}</p>
                
                {/* Framework Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {pkg.description?.toLowerCase().includes('qbcore') && (
                    <span className="px-3 py-1 bg-red-900/30 border border-red-700 text-red-300 text-xs font-semibold rounded-lg">QBCore</span>
                  )}
                  {pkg.description?.toLowerCase().includes('qbox') && (
                    <span className="px-3 py-1 bg-yellow-900/30 border border-yellow-700 text-yellow-300 text-xs font-semibold rounded-lg">Qbox</span>
                  )}
                  {pkg.description?.toLowerCase().includes('esx') && (
                    <span className="px-3 py-1 bg-orange-900/30 border border-orange-700 text-orange-300 text-xs font-semibold rounded-lg">ESX</span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-white">{pkg.name}</h1>
              </div>
              {hasDiscount && (
                <span className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-bold flex-shrink-0 ml-4">
                  SALE
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mb-8 pb-8 border-b border-neutral-800">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-blue-400">
                  {pkg.total_price === 0 ? 'Free' : formatPrice(pkg.total_price, pkg.currency)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-neutral-600 line-through">
                    {formatPrice(pkg.base_price, pkg.currency)}
                  </span>
                )}
              </div>
              <p className="text-neutral-600 text-sm mt-1">Tax included</p>
            </div>

            {/* Description */}
            <div className="mb-8 max-h-48 overflow-y-auto pr-2">
              <div
                className="text-neutral-400 leading-relaxed text-sm"
                dangerouslySetInnerHTML={{ __html: pkg.description }}
              />
            </div>

            {/* Feedback */}
            {error && (
              <div className="mb-4 bg-red-900/20 border border-red-900 rounded-xl p-4 text-red-300 text-sm flex gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}
            {added && (
              <div className="mb-4 bg-green-900/20 border border-green-800 rounded-xl p-4 text-green-300 text-sm flex gap-2">
                <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Added to cart successfully!{' '}
                <Link href="/cart" className="underline hover:text-green-200">View Cart →</Link>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {!pkg.disable_quantity && (
                <div className="flex items-center gap-4 mb-4">
                  <label className="text-neutral-300 text-sm font-medium">Quantity:</label>
                  <div className="flex items-center border border-neutral-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                    >
                      -
                    </button>
                    <span className="w-12 py-2 text-center text-white">{quantity}</span>
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
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {adding ? 'Adding to Cart...' : 'Add to Cart'}
              </button>

              <Link
                href="/cart"
                className="w-full flex items-center justify-center border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white font-medium py-3 rounded-xl transition"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
