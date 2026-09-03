import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AreasPage } from '@/components/pages/AreasPage';
import { ContactPage } from '@/components/pages/ContactPage';
import { DocPage } from '@/components/pages/DocPage';
import { Model3dPage } from '@/components/pages/Model3dPage';
import { TechPage } from '@/components/pages/TechPage';
import { allSubRoutes, isLocale, resolveRoute, routeSegments, type Locale } from '@/lib/i18n';
import { metadataFor } from '@/lib/page-meta';

type Params = { locale: string; slug: string[] };

/**
 * Ana sayfa dışındaki bütün adresler buradan geçer. Hangi sayfanın çizileceğini
 * `resolveRoute` belirler; böylece her dilin kendi URL parçaları tek bir
 * tablodan yönetilir (bkz. `lib/i18n.ts`).
 */
export function generateStaticParams({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : 'tr';
  return allSubRoutes().map((route) => ({ slug: routeSegments(locale, route) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const route = resolveRoute(raw, slug ?? []);
  if (!route) return {};
  return metadataFor(raw, route);
}

export default async function CatchAllPage({ params }: { params: Promise<Params> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const route = resolveRoute(locale, slug ?? []);
  if (!route) notFound();

  switch (route.kind) {
    case 'areas':
      return <AreasPage locale={locale} />;
    case 'tech':
      return <TechPage locale={locale} />;
    case 'contact':
      return <ContactPage locale={locale} />;
    case 'model3d':
      return <Model3dPage locale={locale} />;
    case 'doc':
      return <DocPage locale={locale} doc={route.doc} />;
    default:
      notFound();
  }
}
