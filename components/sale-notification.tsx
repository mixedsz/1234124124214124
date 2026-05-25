'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Percent } from 'lucide-react';

interface SaleProduct {
  id: number;
  name: string;
  image?: string;
  base_price: number;
  total_price: number;
  currency: string;
  discount: number;
}

function fmt(price: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
}

export function SaleNotification() {
  const [products, setProducts] = useState<SaleProduct[]>([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('sale_dismissed')) return;

    fetch('/api/sale-products')
      .then(r => r.json())
      .then((data: SaleProduct[]) => {
        if (data.length > 0) {
          setProducts(data);
          setTimeout(() => setVisible(true), 4000);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (products.length <= 1) return;
    const id = setInterval(() => setIndex(i => (i + 1) % products.length), 7000);
    return () => clearInterval(id);
  }, [products.length]);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem('sale_dismissed', '1');
  };

  if (!visible || products.length === 0) return null;

  const p = products[index];
  const pct = Math.round(p.discount);
  // Use total_price if it's genuinely discounted, otherwise derive from percentage
  const discountedPrice = p.total_price < p.base_price
    ? p.total_price
    : p.base_price * (1 - p.discount / 100);
  const save = p.base_price - discountedPrice;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-800/80 border-b border-neutral-700/60">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-blue-600/20 flex items-center justify-center flex-shrink-0">
            <Percent className="w-3 h-3 text-blue-400" />
          </div>
          <span className="text-white text-[11px] font-bold tracking-wider uppercase">Limited Sale</span>
          {products.length > 1 && (
            <span className="text-neutral-500 text-[10px] ml-1">{index + 1}/{products.length}</span>
          )}
        </div>
        <button onClick={dismiss} className="text-neutral-500 hover:text-white transition">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product row */}
      <div className="flex gap-3 p-4">
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-neutral-700"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-blue-600/10 border border-neutral-700 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-400 font-bold text-xl">{p.name.charAt(0)}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-snug line-clamp-2">{p.name}</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-blue-400 font-bold">{fmt(discountedPrice, p.currency)}</span>
            <span className="text-neutral-500 text-xs line-through">{fmt(p.base_price, p.currency)}</span>
          </div>
          <p className="text-neutral-500 text-[11px] mt-0.5">
            Save {fmt(save, p.currency)} &middot; {pct}% off
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <Link
          href={`/product/${p.id}`}
          onClick={dismiss}
          className="block text-center py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition"
        >
          Claim Deal Now
        </Link>
      </div>
    </div>
  );
}
