import type { Metadata } from 'next';
import { cache } from 'react';
import { getPackage } from '@/lib/tebex';
import ProductClientPage from './product-client';

// Cache the getPackage call to dedupe between generateMetadata and page render
const getCachedPackage = cache(async (id: number) => {
  return getPackage(id).catch(() => null);
});

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const pkg = await getCachedPackage(Number(id));
  if (!pkg) return { title: 'Product' };

  // Strip HTML tags from description for meta
  const plainDescription = pkg.description 
    ? pkg.description.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160)
    : 'Premium FiveM script for QBCore, Qbox & ESX.';

  return {
    title: pkg.name,
    description: plainDescription,
    openGraph: {
      type: 'website',
      siteName: 'Flake Development',
      title: `${pkg.name} | Flake Development | QBCore, Qbox & ESX FiveM Scripts`,
      description: plainDescription,
      images: pkg.image ? [
        {
          url: pkg.image,
          width: 512,
          height: 512,
          alt: pkg.name,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pkg.name} | Flake Development | QBCore, Qbox & ESX FiveM Scripts`,
      description: plainDescription,
      images: pkg.image ? [pkg.image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Uses cached data from generateMetadata - no duplicate fetch
  const pkg = await getCachedPackage(Number(id));
  
  return <ProductClientPage initialPackage={pkg} />;
}
