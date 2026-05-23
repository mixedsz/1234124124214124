'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getPackage, formatPrice } from '@/lib/tebex';
import { useEffect, useState } from 'react';
import { TebexPackage } from '@/lib/tebex';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, AlertCircle, Check } from 'lucide-react';
import { useBasket } from '@/hooks/use-basket';
import { marked } from 'marked';

// Configure marked for safe rendering
marked.use({
  breaks: true,
  gfm: true,
});

// Helper to parse description - handles both HTML and markdown
function parseDescription(description: string): string {
  if (!description) return '';
  
  // If already HTML, return as-is but with link styling
  if (description.includes('<p>') || description.includes('<br') || description.includes('<ul>')) {
    // Add styling to links
    return description
      .replace(/<a /g, '<a class="text-blue-400 hover:text-blue-300 underline" ')
      .replace(/<strong>/g, '<strong class="font-bold text-white">')
      .replace(/<ul>/g, '<ul class="list-disc list-inside space-y-1 my-2">')
      .replace(/<li>/g, '<li class="text-neutral-300">');
  }
  
  // Parse as markdown
  const html = marked.parse(description, { async: false }) as string;
  
  // Add styling classes
  return html
    .replace(/<a /g, '<a class="text-blue-400 hover:text-blue-300 underline" ')
    .replace(/<strong>/g, '<strong class="font-bold text-white">')
    .replace(/<ul>/g, '<ul class="list-disc list-inside space-y-1 my-2">')
    .replace(/<li>/g, '<li class="text-neutral-300">')
    .replace(/<h1>/g, '<h1 class="text-xl font-bold text-white mt-4 mb-2">')
    .replace(/<h2>/g, '<h2 class="text-lg font-bold text-white mt-3 mb-2">')
    .replace(/<h3>/g, '<h3 class="text-base font-bold text-white mt-2 mb-1">')
    .replace(/<p>/g, '<p class="mb-2">');
}

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
  const parsedDescription = parseDescription(pkg.description);

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
            <div className="bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-700 aspect-video">
              {pkg.image ? (
                <img src={pkg.image} alt={pkg.name} className="w-full h-full object-contain" />
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
                
                {/* Framework Badges - Light variant style like Mantine */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-red-500/15 text-red-400 text-xs font-semibold rounded">QBCore</span>
                  <span className="px-2.5 py-1 bg-yellow-500/15 text-yellow-400 text-xs font-semibold rounded">Qbox</span>
                  <span className="px-2.5 py-1 bg-orange-500/15 text-orange-400 text-xs font-semibold rounded">ESX</span>
                </div>

                <h1 className="text-3xl font-bold text-white">{pkg.name}</h1>
              </div>
              {hasDiscount && (
                <span className="bg-green-500 text-white px-3 py-1 rounded text-sm font-bold flex-shrink-0 ml-4">
                  SALE
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mb-8 pb-8 border-b border-neutral-800">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-white">
                  {pkg.total_price === 0 ? 'Free' : formatPrice(pkg.total_price, pkg.currency)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-neutral-600 line-through">
                    {formatPrice(pkg.base_price, pkg.currency)}
                  </span>
                )}
              </div>
              <p className="text-neutral-500 text-sm mt-1">Tax included</p>
            </div>

            {/* Description with proper markdown rendering */}
            <div className="mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              <div
                className="text-neutral-400 leading-relaxed text-sm prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: parsedDescription }}
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
