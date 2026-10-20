import { getDictionary } from '@/content';
import { getUi } from '@/content/ui';
import { href, htmlLang, type Locale, type Route } from '@/lib/i18n';
import { routeMeta } from '@/lib/page-meta';
import { absolute, schemaId } from '@/lib/site';

/**
 * Veriden gelen bir metin `</script>` içerirse etiketi erken kapatıp sayfaya
 * kod sokabilir. `<` karakterini Unicode kaçışına (u003c) çevirmek bu kapıyı
 * kapatır; JSON ayrıştırıcıları kaçışı yine normal `<` olarak okur.
 */
function serialize(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** Yapılandırılmış veriyi sayfaya gömer. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Çıktı serialize() ile kaçırıldı; bkz. yukarıdaki not.
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}

/** Site içi yolu tam adrese çevirir; zaten tam olan adresi olduğu gibi bırakır. */
const toAbsolute = (url: string) => (/^https?:\/\//.test(url) ? url : absolute(url));

/**
 * Kırıntı navigasyonu. Ana sayfa basamağı otomatik eklenir — çağıran yalnızca
 * ana sayfadan sonraki basamakları verir.
 */
export function breadcrumbJsonLd(locale: Locale, trail: { name: string; url: string }[]) {
  const home = { name: getUi(locale).breadcrumbHome, url: href(locale, { kind: 'home' }) };
  const steps = trail[0]?.url === home.url ? trail : [home, ...trail];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: steps.map((step, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: step.name,
      item: toAbsolute(step.url),
    })),
  };
}

type WebPageInput = {
  locale: Locale;
  /** Sayfanın adresi: site içi yol (`/tr/iletisim`) ya da tam URL */
  url: string;
  name: string;
  description: string;
  /** Daha özel şema türü — iletişim sayfası ContactPage, hakkımızda AboutPage… */
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'ItemPage';
  /** Sayfanın ana görseli (site içi yol) */
  image?: string;
  /** ISO 8601 tarih — hukuki dokümanların son güncellenme bilgisi için */
  dateModified?: string;
  /** `breadcrumbJsonLd` çıktısı; verilirse sayfaya bağlanır */
  breadcrumb?: unknown;
};

/** Tek bir sayfanın yapılandırılmış verisi; site ve kuruluş düğümlerine `@id` ile bağlanır. */
export function webPageJsonLd({
  locale,
  url,
  name,
  description,
  type = 'WebPage',
  image,
  dateModified,
  breadcrumb,
}: WebPageInput) {
  const pageUrl = toAbsolute(url);
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${pageUrl}#webpage`,
    name,
    description,
    url: pageUrl,
    inLanguage: htmlLang[locale],
    isPartOf: { '@id': schemaId.website(locale) },
    about: { '@id': schemaId.organization },
    publisher: { '@id': schemaId.organization },
    ...(image ? { primaryImageOfPage: { '@type': 'ImageObject', url: toAbsolute(image) } } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(breadcrumb ? { breadcrumb } : {}),
  };
}

const months: Record<string, number> = {
  ocak: 1, şubat: 2, mart: 3, nisan: 4, mayıs: 5, haziran: 6,
  temmuz: 7, ağustos: 8, eylül: 9, ekim: 10, kasım: 11, aralık: 12,
};

/** Dokümanlardaki "1 Eylül 2026" biçimli tarihi ISO 8601'e çevirir; çözemezse undefined. */
export function docDateIso(text: string): string | undefined {
  const match = /^(\d{1,2}) (\S+) (\d{4})$/.exec(text.trim());
  const month = match ? months[match[2].toLocaleLowerCase('tr')] : undefined;
  if (!match || !month) return undefined;
  return `${match[3]}-${String(month).padStart(2, '0')}-${match[1].padStart(2, '0')}`;
}

const pageTypes: Partial<Record<Route['kind'], WebPageInput['type']>> = {
  areas: 'CollectionPage',
  contact: 'ContactPage',
  model3d: 'ItemPage',
};

/**
 * Bir rotanın sayfa düğümleri: WebPage (+ kırıntı), ana sayfada SSS, kullanım
 * alanlarında hizmet listesi. Kuruluş ve site düğümleri yerleşimde basılıyor.
 */
export function routeJsonLd(locale: Locale, route: Route): unknown[] {
  const t = getDictionary(locale);
  const ui = getUi(locale);
  const { title, description } = routeMeta(locale, route);
  const url = href(locale, route);

  if (route.kind === 'home') {
    return [
      webPageJsonLd({ locale, url, name: title, description }),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${absolute(url)}#faq`,
        inLanguage: htmlLang[locale],
        isPartOf: { '@id': `${absolute(url)}#webpage` },
        mainEntity: t.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ];
  }

  const crumbName =
    route.kind === 'doc'
      ? t.docs[route.doc].t
      : route.kind === 'model3d'
        ? t.nav3d
        : t.nav[route.kind];
  const breadcrumb = breadcrumbJsonLd(locale, [{ name: crumbName, url }]);

  const page = webPageJsonLd({
    locale,
    url,
    name: title,
    description,
    type:
      route.kind === 'doc'
        ? route.doc === 'hakkimizda'
          ? 'AboutPage'
          : 'WebPage'
        : pageTypes[route.kind],
    // Tarih iki dilde aynı; ay adları Türkçe çözüldüğü için TR metninden okunuyor.
    dateModified:
      route.kind === 'doc' ? docDateIso(getDictionary('tr').docs[route.doc].u) : undefined,
    breadcrumb,
  });

  if (route.kind !== 'areas') return [page];

  return [
    page,
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: title,
      itemListElement: t.areas.map((area, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          name: area.title,
          description: area.body,
          serviceType: area.catLabel,
          provider: { '@id': schemaId.organization },
          areaServed: { '@type': 'Country', name: ui.areaServed },
        },
      })),
    },
  ];
}
