/**
 * Site metinleri.
 *
 * `site.json`, tasarım dosyası "DroneTek v4.dc.html" içindeki `content` ve
 * `platformData` alanlarından programla çıkarıldı — hiçbir metin elle
 * yazılmadı, bu yüzden Türkçe/İngilizce çeviriler tasarımla birebir aynı.
 * Metni güncellemek için doğrudan `site.json` düzenlenir.
 */
import raw from './site.json';
import type { Locale } from '@/lib/i18n';

export type Dictionary = typeof raw.content.tr;
export type Area = Dictionary['areas'][number];
export type NewsItem = Dictionary['news'][number];
export type DocContent = Dictionary['docs']['hakkimizda'];

export type Platform = {
  id: string;
  type: { tr: string; en: string };
  /** specLabels ile aynı sırada: havada kalış, menzil, yük, hassasiyet, rüzgâr */
  values: string[];
};

export const platformData: Platform[] = raw.platformData;

const dictionaries: Record<Locale, Dictionary> = {
  tr: raw.content.tr,
  en: raw.content.en as Dictionary,
};

/** Verilen dilin tüm metinleri. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/**
 * Teknik veri tablosundaki bazı değerler "42 dk / 42 min" biçiminde iki dili
 * birlikte tutuyor. Tasarımdaki `dur()` yardımcısının aynısı.
 */
export function localizedValue(value: string, locale: Locale): string {
  const parts = String(value).split(' / ');
  if (parts.length < 2) return value;
  return locale === 'en' ? parts[1] : parts[0];
}

/** Kullanım alanı kategorileri — "all" dahil. */
export function getCategories(locale: Locale) {
  return getDictionary(locale).cats;
}

/** Kategoriye göre filtrelenmiş kullanım alanları. */
export function filterAreas(areas: Area[], category: string): Area[] {
  if (!category || category === 'all') return areas;
  return areas.filter((area) => area.cat === category);
}
