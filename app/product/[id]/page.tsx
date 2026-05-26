import type { Metadata } from 'next';
import { getPackage } from '@/lib/tebex';
import ProductClientPage from './product-client';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const pkg = await getPackage(Number(id)).catch(() => null);
  if (!pkg) return { title: 'Product' };

  return {
    title: pkg.name,
    description: null,
    openGraph: {
      title: `${pkg.name} | Flake Development | QBCore, Qbox & ESX FiveM Scripts`,
      description: null,
      images: pkg.image ? [{ url: pkg.image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pkg.name} | Flake Development | QBCore, Qbox & ESX FiveM Scripts`,
      description: null,
      images: pkg.image ? [pkg.image] : undefined,
    },
  };
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  return <ProductClientPage params={params} />;
}
