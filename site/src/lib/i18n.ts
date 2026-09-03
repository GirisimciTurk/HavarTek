/**
 * Dil ve rota tablosu.
 *
 * Her sayfanın her dilde kendi URL parçası var (SEO için Türkçe adresler
 * Türkçe, İngilizce adresler İngilizce). Tüm çözümleme tek bir tablodan
 * yürüdüğü için yeni sayfa eklemek tek yerde değişiklik demek.
 */

export const locales = ['tr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'tr';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** İçerikteki doküman anahtarları (site.json → content.<lang>.docs) */
export const docKeys = [
  'hakkimizda',
  'cerez',
  'kvkk',
  'kosullar',
  'takip',
  'sozlesme',
  'shgm',
  'gizlilik',
] as const;
export type DocKey = (typeof docKeys)[number];

/** Alt bilgide "Destek & Bilgi" sütununda listelenen dokümanlar */
export const supportDocKeys: DocKey[] = ['takip', 'sozlesme', 'shgm', 'gizlilik'];
/** Alt bilgide telif satırının yanında listelenen dokümanlar */
export const legalDocKeys: DocKey[] = ['hakkimizda', 'cerez', 'kvkk', 'kosullar'];

export type PageKey = 'home' | 'areas' | 'tech' | 'contact' | 'model3d';

/** Bir URL'in karşılığı olan sayfa */
export type Route =
  | { kind: PageKey }
  | { kind: 'doc'; doc: DocKey };

const pageSegments: Record<Locale, Record<PageKey, string>> = {
  tr: {
    home: '',
    areas: 'kullanim-alanlari',
    tech: 'teknoloji',
    contact: 'iletisim',
    model3d: '3b-model',
  },
  en: {
    home: '',
    areas: 'applications',
    tech: 'technology',
    contact: 'contact',
    model3d: '3d-model',
  },
};

/** Dokümanların bulunduğu üst klasör */
const docBase: Record<Locale, string> = { tr: 'kurumsal', en: 'legal' };

const docSegments: Record<Locale, Record<DocKey, string>> = {
  tr: {
    hakkimizda: 'hakkimizda',
    cerez: 'cerez-politikasi',
    kvkk: 'kvkk-aydinlatma-metni',
    kosullar: 'kullanim-kosullari',
    takip: 'talep-takibi',
    sozlesme: 'hizmet-sozlesmesi',
    shgm: 'shgm-izin-ve-yetkiler',
    gizlilik: 'gizlilik-ve-veri-guvenligi',
  },
  en: {
    hakkimizda: 'about-us',
    cerez: 'cookie-policy',
    kvkk: 'privacy-notice',
    kosullar: 'terms-of-use',
    takip: 'request-tracking',
    sozlesme: 'service-agreement',
    shgm: 'civil-aviation-permits',
    gizlilik: 'privacy-and-data-security',
  },
};

/** Bir rotanın verilen dildeki adresi: /tr/kullanim-alanlari gibi */
export function href(locale: Locale, route: Route): string {
  if (route.kind === 'doc') {
    return `/${locale}/${docBase[locale]}/${docSegments[locale][route.doc]}`;
  }
  const segment = pageSegments[locale][route.kind];
  return segment ? `/${locale}/${segment}` : `/${locale}`;
}

/** Kısayol: href(locale, { kind }) */
export function pageHref(locale: Locale, kind: PageKey): string {
  return href(locale, { kind });
}

/** Kısayol: href(locale, { kind: 'doc', doc }) */
export function docHref(locale: Locale, doc: DocKey): string {
  return href(locale, { kind: 'doc', doc });
}

/** URL parçalarını rotaya çevirir; eşleşme yoksa null (→ 404). */
export function resolveRoute(locale: Locale, segments: string[]): Route | null {
  if (segments.length === 0) return { kind: 'home' };

  if (segments.length === 1) {
    const [segment] = segments;
    const entry = (Object.keys(pageSegments[locale]) as PageKey[]).find(
      (key) => key !== 'home' && pageSegments[locale][key] === segment,
    );
    return entry ? { kind: entry } : null;
  }

  if (segments.length === 2 && segments[0] === docBase[locale]) {
    const doc = docKeys.find((key) => docSegments[locale][key] === segments[1]);
    return doc ? { kind: 'doc', doc } : null;
  }

  return null;
}

/** Ana sayfa dışındaki tüm rotalar — statik üretim ve site haritası için. */
export function allSubRoutes(): Route[] {
  const pages: Route[] = (Object.keys(pageSegments.tr) as PageKey[])
    .filter((key) => key !== 'home')
    .map((kind) => ({ kind }));
  const docs: Route[] = docKeys.map((doc) => ({ kind: 'doc', doc }));
  return [...pages, ...docs];
}

/** Ana sayfa dahil tüm rotalar. */
export function allRoutes(): Route[] {
  return [{ kind: 'home' }, ...allSubRoutes()];
}

/** Bir rotanın URL parçaları: { kind:'areas' } → ['kullanim-alanlari'] */
export function routeSegments(locale: Locale, route: Route): string[] {
  if (route.kind === 'doc') return [docBase[locale], docSegments[locale][route.doc]];
  const segment = pageSegments[locale][route.kind];
  return segment ? [segment] : [];
}

export const otherLocale = (locale: Locale): Locale => (locale === 'tr' ? 'en' : 'tr');

/** <html lang> ve hreflang değerleri */
export const htmlLang: Record<Locale, string> = { tr: 'tr-TR', en: 'en' };

/** Kullanım alanları sayfasındaki kategori filtresinin sorgu parametresi. */
export const categoryParam: Record<Locale, string> = { tr: 'kategori', en: 'category' };

/**
 * Aktif dili sunucu bileşenlerine taşıyan istek başlığı. Proxy ekler;
 * `params` alamayan 404 sınırı bunu okur.
 */
export const LOCALE_HEADER = 'x-dronetek-locale';
