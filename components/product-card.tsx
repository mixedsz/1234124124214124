import Link from 'next/link';
import { TebexPackage, formatPrice } from '@/lib/tebex';

interface ProductCardProps {
  package_: TebexPackage;
  tags?: string[];
}

export function ProductCard({ package_, tags = ['QBCORE', 'QBOX', 'ESX'] }: ProductCardProps) {
  const hasDiscount = package_.discount > 0;
  const originalPrice = package_.base_price;
  const discountedPrice = package_.total_price;

  return (
    <Link
      href={`/product/${package_.id}`}
      className="group block bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-blue-500/50 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-neutral-800 overflow-hidden">
        {package_.image ? (
          <img
            src={package_.image}
            alt={package_.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-blue-600/10">
            <span className="text-4xl font-bold text-blue-500/50">{package_.name.charAt(0)}</span>
          </div>
        )}

        {/* Sale Badge */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">
            SALE
          </div>
        )}

        {/* New Badge */}
        {package_.created_at && isNewProduct(package_.created_at) && !hasDiscount && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
            NEW
          </div>
        )}

        {/* Tags overlay at bottom of image */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] font-semibold rounded bg-black/70 text-white backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
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
