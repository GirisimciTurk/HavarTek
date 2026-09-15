/**
 * Tek başına duran (kart başlığından türetilemeyen) fotoğrafların alternatif
 * metinleri. Tasarımdaki `alt` açıklamalarından alındı.
 */
import type { Locale } from '@/lib/i18n';
import type { SlotId } from '@/lib/photos';

type AltMap = Partial<Record<SlotId, string>>;

const tr: AltMap = {
  hero: 'Solda dumanlı kara yolu trafiği, sağda açık gökyüzünde kargo taşıyan drone',
  'promise-bg': '',
  stories: 'Gece uçuşunda acil teslim',
  'why-air': 'Gün batımında uçuş koridorunda ilerleyen drone',
  'request-bg': 'Uçuş öncesi hazırlık',
  'areas-hero': 'Yük taşıyan drone, açık gökyüzünde yakın çekim',
  'tech-hero': 'Hangarda seri üretime hazırlanan VK-9 VTOL platformu',
  'not-found': 'Tarlaların üzerinde uçuş yapan drone',
  software: 'Yer kontrol istasyonu ekranı ve işlenmiş harita çıktısı',
};

const en: AltMap = {
  hero: 'Smoky road traffic on the left, a cargo drone in a clear sky on the right',
  'promise-bg': '',
  stories: 'Emergency delivery on a night flight',
  'why-air': 'Drone flying along a corridor at sunset',
  'request-bg': 'Pre-flight preparation',
  'areas-hero': 'Close-up of a drone carrying a payload against a clear sky',
  'tech-hero': 'VK-9 VTOL platform being prepared for serial production in the hangar',
  'not-found': 'Drone flying over farmland',
  software: 'Ground control station screen with a processed map output',
};

const maps: Record<Locale, AltMap> = { tr, en };

export function photoAlt(locale: Locale, slot: SlotId): string {
  return maps[locale][slot] ?? '';
}
