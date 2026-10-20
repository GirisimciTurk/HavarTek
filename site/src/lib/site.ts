import type { Metadata } from 'next';

import { getDictionary } from '@/content';
import { getUi } from '@/content/ui';
import { href, htmlLang, locales, type Locale, type Route } from '@/lib/i18n';

/** Kanonik adres. VPS'te NEXT_PUBLIC_SITE_URL ile ayarlanır. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://goktek.com').replace(
  /\/+$/,
  '',
);

export const absolute = (path: string) => `${siteUrl}${path}`;

/** Open Graph `dil_BÖLGE` biçimi ister (tr_TR); hreflang'deki tr-TR değil. */
const ogLocale: Record<Locale, string> = { tr: 'tr_TR', en: 'en_US' };

/** Yapılandırılmış veride düğümlerin birbirine bağlandığı kimlikler. */
export const schemaId = {
  organization: `${siteUrl}/#organization`,
  website: (locale: Locale) => `${absolute(href(locale, { kind: 'home' }))}#website`,
};

export const ORG = {
  name: 'GökTek',
  legalName: 'GökTek İnsansız Hava Aracı Sistemleri A.Ş.',
  email: 'bedirkaraabali@girisimciturk.com',
  /** Çağrı merkezi (tasarımdaki tel: bağlantısı); EN sayfada uluslararası biçim */
  phone: '0850 241 70 00',
  phoneIntl: '+90 850 241 70 00',
  phoneRaw: '+908502417000',
  /** WhatsApp hattı — wa.me bağlantısı için ülke kodlu, artısız */
  whatsapp: '0544 694 32 78',
  whatsappRaw: '905446943278',
  address: {
    district: 'Gölbaşı',
    city: 'Ankara',
    country: 'TR',
  },
  parent: 'DEV YAPIMCILIK YAYINCILIK SAN. TİC. LTD. ŞTİ.',
} as const;

/** Grubun festivali; sitede duyuru şeridi, menü ve alt bilgiden bağlanır. */
export const FEST = { name: 'Girişimci Fest 2027', url: 'https://girisimcifest.com/' } as const;

/**
 * Festival bağlantısı. UTM etiketleri, ziyaretin hangi yerleşimden geldiğini
 * girisimcifest.com analitiğinde ayırt etmek için.
 */
export function festHref(placement: 'bar' | 'nav' | 'footer'): string {
  const params = new URLSearchParams({
    utm_source: 'goktek',
    utm_medium: 'referral',
    utm_campaign: 'girisimcifest-2027',
    utm_content: placement,
  });
  return `${FEST.url}?${params}`;
}

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
  // Ana sayfa başlığı markayla başlıyor, diğer sayfalarda marka sonda. `absolute`
  // kullanılıyor ki üst yerleşimdeki başlık şablonu eki ikinci kez eklemesin.
  const fullTitle = route.kind === 'home' ? title : `${title} — ${ui.titleSuffix}`;

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
      locale: ogLocale[locale],
      alternateLocale: locales.filter((code) => code !== locale).map((code) => ogLocale[code]),
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

/**
 * Kuruluş ve web sitesi düğümleri — her sayfada yerleşimden basılır. Sayfa
 * düğümleri bunlara `@id` ile bağlanır (bkz. components/JsonLd.tsx).
 */
export function siteJsonLd(locale: Locale) {
  const t = getDictionary(locale);
  const ui = getUi(locale);
  const contactLanguages = ['Turkish', 'English'];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': schemaId.organization,
        name: ORG.name,
        legalName: ORG.legalName,
        url: siteUrl,
        logo: { '@type': 'ImageObject', url: absolute('/logo.png'), width: 512, height: 512 },
        description: ui.seo.home.description,
        slogan: t.ft.desc,
        email: ORG.email,
        telephone: ORG.phoneIntl,
        address: {
          '@type': 'PostalAddress',
          addressLocality: ORG.address.district,
          addressRegion: ORG.address.city,
          addressCountry: ORG.address.country,
        },
        areaServed: { '@type': 'Country', name: ui.areaServed },
        knowsAbout: [...t.areas.map((area) => area.title), ...t.payloads.map((p) => p.t)],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: ORG.phoneIntl,
            email: ORG.email,
            areaServed: ORG.address.country,
            availableLanguage: contactLanguages,
          },
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            telephone: `+${ORG.whatsappRaw}`,
            url: `https://wa.me/${ORG.whatsappRaw}`,
            areaServed: ORG.address.country,
            availableLanguage: contactLanguages,
          },
        ],
        parentOrganization: { '@type': 'Organization', name: ORG.parent },
        sameAs: ['https://girisimciturk.com'],
      },
      {
        '@type': 'WebSite',
        '@id': schemaId.website(locale),
        name: ORG.name,
        url: absolute(href(locale, { kind: 'home' })),
        inLanguage: htmlLang[locale],
        description: ui.seo.home.description,
        publisher: { '@id': schemaId.organization },
      },
    ],
  };
}
