import type { Metadata } from 'next';

import { getDictionary } from '@/content';
import { getUi } from '@/content/ui';
import type { Locale, Route } from '@/lib/i18n';
import { buildMetadata } from '@/lib/site';

/** Bir rotanın başlık ve açıklaması — içerik sözlüğünden türetilir. */
export function routeMeta(locale: Locale, route: Route): { title: string; description: string } {
  const t = getDictionary(locale);
  const ui = getUi(locale);

  switch (route.kind) {
    case 'home':
      return {
        title: `${t.hero.l1} ${t.hero.l2}`.replace(/\s+/g, ' ').trim(),
        description: t.hero.sub,
      };
    case 'areas':
      return { title: t.apTitle, description: t.apLead };
    case 'tech':
      return { title: t.tpTitle, description: t.tpLead };
    case 'contact':
      return { title: t.reqTitle, description: t.reqBody };
    case 'model3d':
      return { title: ui.model3d.title, description: ui.model3d.lead };
    case 'doc': {
      const doc = t.docs[route.doc];
      const first = doc.s[0]?.p[0] ?? ui.metaDescription;
      return { title: doc.t, description: first.slice(0, 300) };
    }
  }
}

export function metadataFor(locale: Locale, route: Route): Metadata {
  const { title, description } = routeMeta(locale, route);
  return buildMetadata({ locale, route, title, description });
}
