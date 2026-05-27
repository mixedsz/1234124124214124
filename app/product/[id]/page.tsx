import type { Metadata } from 'next';
import { getPackage } from '@/lib/tebex';
import ProductClientPage from './product-client';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const pkg = await getPackage(Number(id)).catch(() => null);
  if (!pkg) return { title: 'Product' };

  // Strip HTML tags from description for meta
  const plainDescription = pkg.description 
    ? pkg.description.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160)
    : 'Premium FiveM script for QBCore, Qbox & ESX.';

  return {
    title: pkg.name,
    description: plainDescription,
    openGraph: {
      type: 'product',
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
      card: 'summary',
      title: `${pkg.name} | Flake Development | QBCore, Qbox & ESX FiveM Scripts`,
      description: plainDescription,
      images: pkg.image ? [pkg.image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Prefetch the package data on the server
  const pkg = await getPackage(Number(id)).catch(() => null);
  
  return <ProductClientPage params={params} initialPackage={pkg} />;
}
