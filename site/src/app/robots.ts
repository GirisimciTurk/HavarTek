import type { MetadataRoute } from 'next';

import { absolute, siteUrl } from '@/lib/site';

/**
 * Tüm sayfalar taranabilir. Yalnızca form/abonelik uçları (`/api/`) dışarıda —
 * dizine girecek içerikleri yok, tarama bütçesini boşa harcamasınlar.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: absolute('/sitemap.xml'),
    host: siteUrl,
  };
}
