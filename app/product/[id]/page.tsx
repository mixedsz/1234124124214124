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

  const SITE_DESC = 'Premium FiveM scripts trusted by Grizzley World, District 10, and hundreds of top servers. QBCore, Qbox & ESX compatible. Instant Cfx.re delivery, free updates forever.';

  return {
    title: pkg.name,
    description: SITE_DESC,
    openGraph: {
      type: 'website',
      siteName: 'Flake Development',
      title: `${pkg.name} | Flake Development | QBCore, Qbox & ESX FiveM Scripts`,
      description: SITE_DESC,
      images: pkg.image ? [
        {
          url: pkg.image,
          width: 256,
          height: 256,
          alt: pkg.name,
        }
      ] : [{ url: 'https://flakedev.com/fd-square.png', width: 256, height: 256, alt: 'Flake Development' }],
    },
    twitter: {
      card: 'summary',
      title: `${pkg.name} | Flake Development | QBCore, Qbox & ESX FiveM Scripts`,
      description: SITE_DESC,
      images: pkg.image ? [pkg.image] : ['https://flakedev.com/fd-square.png'],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Uses cached data from generateMetadata - no duplicate fetch
  const pkg = await getCachedPackage(Number(id));
  
  return <ProductClientPage initialPackage={pkg} />;
}
