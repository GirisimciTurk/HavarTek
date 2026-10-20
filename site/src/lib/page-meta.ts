import type { Metadata } from 'next';

import { getDictionary } from '@/content';
import { getUi } from '@/content/ui';
import type { Locale, Route } from '@/lib/i18n';
import { buildMetadata } from '@/lib/site';

/** Google arama sonucunda açıklamayı ~160 karakterde keser. */
const DESCRIPTION_MAX = 160;

/** Uzun metni kelime sınırında kısaltır; kesildiyse sonuna üç nokta koyar. */
function clip(text: string, max = DESCRIPTION_MAX): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.—-]+$/, '')}…`;
}

/**
 * Bir rotanın arama sonucu başlığı ve açıklaması. Sayfalar `ui.seo` tablosundan,
 * dokümanlar kendi başlığından ve ilk paragrafından gelir.
 */
export function routeMeta(locale: Locale, route: Route): { title: string; description: string } {
  const ui = getUi(locale);

  if (route.kind === 'doc') {
    const doc = getDictionary(locale).docs[route.doc];
    const first = doc.s[0]?.p[0] ?? ui.seo.home.description;
    return { title: doc.t, description: clip(first) };
  }
  return ui.seo[route.kind];
}

export function metadataFor(locale: Locale, route: Route): Metadata {
  const { title, description } = routeMeta(locale, route);
  return buildMetadata({ locale, route, title, description });
}
