import { getUi } from '@/content/ui';
import { href, htmlLang, type Locale } from '@/lib/i18n';
import { absolute, ORG, siteUrl } from '@/lib/site';

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

/** Tek bir sayfanın yapılandırılmış verisi. */
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
  return {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url: toAbsolute(url),
    inLanguage: htmlLang[locale],
    isPartOf: {
      '@type': 'WebSite',
      name: ORG.name,
      url: absolute(href(locale, { kind: 'home' })),
    },
    publisher: { '@type': 'Organization', name: ORG.name, url: siteUrl },
    ...(image ? { primaryImageOfPage: { '@type': 'ImageObject', url: toAbsolute(image) } } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(breadcrumb ? { breadcrumb } : {}),
  };
}
