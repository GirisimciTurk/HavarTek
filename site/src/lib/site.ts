import type { Metadata } from 'next';

import { getDictionary } from '@/content';
import { getUi } from '@/content/ui';
import { href, htmlLang, locales, type Locale, type Route } from '@/lib/i18n';

/** Kanonik adres. VPS'te NEXT_PUBLIC_SITE_URL ile ayarlanır. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dronetek.com.tr').replace(
  /\/+$/,
  '',
);

export const absolute = (path: string) => `${siteUrl}${path}`;

export const ORG = {
  name: 'DroneTek',
  legalName: 'DroneTek İnsansız Hava Aracı Sistemleri A.Ş.',
  email: 'iletisim@dronetek.com.tr',
  phone: '+90 544 694 32 78',
  phoneRaw: '+905446943278',
  address: {
    street: 'Teknopark İzmir',
    district: 'Urla',
    city: 'İzmir',
    country: 'TR',
  },
  parent: 'DEV YAPIMCILIK YAYINCILIK SAN. TİC. LTD. ŞTİ.',
} as const;

type MetaInput = {
  locale: Locale;
  route: Route;
  title: string;
  description: string;
  /** Sayfaya özel sosyal paylaşım görseli (public altında bir yol). */
  image?: string;
};

/**
 * Sayfa üst verisi: kanonik adres, iki dil için hreflang bağlantıları ve
 * Open Graph / Twitter kartları.
 */
export function buildMetadata({ locale, route, title, description, image }: MetaInput): Metadata {
  const ui = getUi(locale);
  const path = href(locale, route);
  const languages = Object.fromEntries(
    locales.map((code) => [htmlLang[code], absolute(href(code, route))]),
  );

  const ogImage = image ?? '/opengraph-image';
  // Ana sayfada marka önde, diğer sayfalarda sonda. `absolute` kullanılıyor ki
  // üst yerleşimdeki başlık şablonu eki ikinci kez eklemesin.
  const fullTitle = route.kind === 'home' ? ui.homeTitle : `${title} — ${ui.titleSuffix}`;

  return {
    // Her sayfa kendi başına da mutlak adres üretebilsin (og:image, canonical).
    metadataBase: new URL(siteUrl),
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: absolute(path),
      languages: { ...languages, 'x-default': absolute(href('tr', route)) },
    },
    openGraph: {
      type: 'website',
      siteName: ui.siteName,
      locale: htmlLang[locale],
      url: absolute(path),
      title: fullTitle,
      description,
      images: [{ url: absolute(ogImage), width: 1200, height: 630, alt: ui.siteName }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [absolute(ogImage)],
    },
  };
}

/** Arama motorları için kuruluş yapılandırılmış verisi. */
export function organizationJsonLd(locale: Locale) {
  const t = getDictionary(locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG.name,
    legalName: ORG.legalName,
    url: absolute(href(locale, { kind: 'home' })),
    logo: absolute('/logo.png'),
    description: t.ft.desc,
    email: ORG.email,
    telephone: ORG.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORG.address.street,
      addressLocality: `${ORG.address.district} / ${ORG.address.city}`,
      addressCountry: ORG.address.country,
    },
    parentOrganization: { '@type': 'Organization', name: ORG.parent },
    sameAs: ['https://girisimciturk.com'],
  };
}
