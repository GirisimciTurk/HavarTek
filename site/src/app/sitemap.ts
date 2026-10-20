import type { MetadataRoute } from 'next';

import { docDateIso } from '@/components/JsonLd';
import { getDictionary } from '@/content';
import { allRoutes, defaultLocale, href, htmlLang, locales, type Route } from '@/lib/i18n';
import { absolute } from '@/lib/site';

type Hint = {
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  priority: number;
};

/**
 * Rota türüne göre tarama ipuçları. İçerik sayfaları sık, hukuki dokümanlar
 * neredeyse hiç değişmiyor; öncelikler de bu hiyerarşiyi izliyor.
 */
const hints: Record<Route['kind'], Hint> = {
  home: { changeFrequency: 'weekly', priority: 1 },
  areas: { changeFrequency: 'monthly', priority: 0.9 },
  tech: { changeFrequency: 'monthly', priority: 0.9 },
  contact: { changeFrequency: 'monthly', priority: 0.8 },
  model3d: { changeFrequency: 'yearly', priority: 0.6 },
  doc: { changeFrequency: 'yearly', priority: 0.3 },
};

/** Bir rotanın tüm dillerdeki karşılıkları — hreflang bağlantıları için. */
function languagesFor(route: Route) {
  const languages = Object.fromEntries(
    locales.map((locale) => [htmlLang[locale], absolute(href(locale, route))]),
  );
  return { ...languages, 'x-default': absolute(href(defaultLocale, route)) };
}

/**
 * Her dil × her rota. Aynı sayfanın diğer dildeki karşılığı `alternates` ile
 * bildiriliyor; böylece arama motorları iki sürümü kopya değil çeviri sayıyor.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Site haritası derlemede üretiliyor: sayfalar için tarih yayın anı,
  // dokümanlar için metindeki "Son güncelleme" tarihi.
  const built = new Date();
  const docs = getDictionary('tr').docs;
  const lastModified = (route: Route) =>
    (route.kind === 'doc' && docDateIso(docs[route.doc].u)) || built;
  const routes = allRoutes();

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: absolute(href(locale, route)),
      lastModified: lastModified(route),
      changeFrequency: hints[route.kind].changeFrequency,
      priority: hints[route.kind].priority,
      alternates: { languages: languagesFor(route) },
    })),
  );
}
