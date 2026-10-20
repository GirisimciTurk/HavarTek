import type { MetadataRoute } from 'next';

import { absolute, siteUrl } from '@/lib/site';

/**
 * Yapay zekâ arama ve yanıt motorlarının tarayıcıları. `*` kuralı onları da
 * kapsıyor; yine de adlarıyla yazılıyor ki izin açıkça görünsün ve ileride
 * genel kural daralırsa bunlar etkilenmesin.
 */
const aiCrawlers = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'meta-externalagent',
  'CCBot',
];

/**
 * Tüm sayfalar taranabilir. Yalnızca form/abonelik uçları (`/api/`) dışarıda —
 * dizine girecek içerikleri yok, tarama bütçesini boşa harcamasınlar.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      { userAgent: aiCrawlers, allow: '/', disallow: ['/api/'] },
    ],
    sitemap: absolute('/sitemap.xml'),
    host: siteUrl,
  };
}
