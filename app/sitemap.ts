import { MetadataRoute } from 'next';
import { getCategories } from '@/lib/tebex';

const BASE = 'https://flakedev.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                         lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/scripts`,            lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/subscription`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/docs`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/support`,            lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/refunds`,            lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/terms`,              lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/privacy`,            lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  try {
    const categories = await getCategories();
    const productPages: MetadataRoute.Sitemap = categories
      .flatMap(cat => cat.packages ?? [])
      .map(pkg => ({
        url: `${BASE}/product/${pkg.id}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    return [...staticPages, ...productPages];
  } catch {
    return staticPages;
  }
}
