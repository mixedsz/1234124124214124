import Link from 'next/link';
import { TebexPackage, formatPrice } from '@/lib/tebex';

interface ProductCardProps {
  package_: TebexPackage;
}

export function ProductCard({ package_ }: ProductCardProps) {
  const hasDiscount = package_.discount > 0;
  const originalPrice = package_.base_price;
  const discountedPrice = package_.total_price;

  return (
    <Link
      href={`/product/${package_.id}`}
      className="group block bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-blue-500/50 transition-all duration-300"
    >
      {/* Image - use object-contain to show full image */}
      <div className="relative aspect-video bg-neutral-800 overflow-hidden">
        {package_.image ? (
          <img
            src={package_.image}
            alt={package_.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-blue-600/10">
            <span className="text-4xl font-bold text-blue-500/50">{package_.name.charAt(0)}</span>
          </div>
        )}

        {/* Sale Badge */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
            SALE
          </div>
        )}

        {/* New Badge */}
        {package_.created_at && isNewProduct(package_.created_at) && !hasDiscount && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
            NEW
          </div>
        )}
      </div>

      {/* Content - badges above title */}
      <div className="p-4">
        {/* Framework Tags - light variant style like Mantine */}
        <div className="flex gap-1.5 mb-2">
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-red-500/15 text-red-400">
            QBCore
          </span>
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-yellow-500/15 text-yellow-400">
            Qbox
          </span>
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-orange-500/15 text-orange-400">
            ESX
          </span>
        </div>

        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
          {package_.name}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="text-lg font-bold text-blue-400">
                {formatPrice(discountedPrice, package_.currency)}
              </span>
              <span className="text-sm text-neutral-500 line-through">
                {formatPrice(originalPrice, package_.currency)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-white">
              {package_.total_price === 0 ? 'Free' : formatPrice(package_.total_price, package_.currency)}
            </span>
          )}
        </div>

        <p className="mt-1 text-xs text-neutral-500">
          {package_.total_price > 0 ? 'Tax Included' : ''}
        </p>
      </div>
    </Link>
  );
}

function isNewProduct(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const daysDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  return daysDiff <= 30;
}
