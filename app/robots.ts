import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/cart', '/orders', '/checkout-complete', '/login'],
      },
    ],
    sitemap: 'https://flakedev.com/sitemap.xml',
  };
}
