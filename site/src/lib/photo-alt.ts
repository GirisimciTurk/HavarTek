/**
 * Tek başına duran (kart başlığından türetilemeyen) fotoğrafların alternatif
 * metinleri. Tasarımdaki `image-slot` yer tutucu açıklamalarından alındı.
 */
import type { Locale } from '@/lib/i18n';
import type { SlotId } from '@/lib/photos';

type AltMap = Partial<Record<SlotId, string>>;

const tr: AltMap = {
  hero: 'Gün doğumunda uçuş halindeki DroneTek platformu, geniş açı',
  'stats-bg': 'Havadan görünüm: tarla ve şantiye deseni',
  'mosaic-0': 'Tarlada ilaçlama uçuşu',
  'mosaic-1': 'Termal kamerayla enerji hattı denetimi',
  'mosaic-2': 'Yer kontrol istasyonu',
  'mosaic-3': 'Kargo teslim noktası',
  'mosaic-4': 'Gece arama uçuşu',
  case: 'İletim hattı koridoru üzerinde denetim uçuşu',
  disaster: 'Afet bölgesinde yardım taşıyan drone ve hasarlı yol',
  join: 'Atölyede birlikte çalışan mühendisler ve girişimciler',
  'cta-bg': 'Alacakaranlıkta kalkışa hazır platform',
  'areas-hero': 'Tarla üzerinde ilaçlama uçuşu, geniş açı saha görüntüsü',
  'tech-hero': 'Sensör yükü görünen platform, yakın çekim',
  'contact-hero': 'Sahada brifing veren DroneTek ekibi',
  software: 'Yer kontrol istasyonu ekranı ve işlenmiş harita çıktısı',
  'contact-office': 'DroneTek ofisi',
  'platform-shot': 'Seçili uçuş platformunun saha fotoğrafı',
};

const en: AltMap = {
  hero: 'DroneTek platform in flight at sunrise, wide angle',
  'stats-bg': 'Aerial view of field and construction site patterns',
  'mosaic-0': 'Spray flight over a field',
  'mosaic-1': 'Thermal power line inspection',
  'mosaic-2': 'Ground control station',
  'mosaic-3': 'Cargo drop-off point',
  'mosaic-4': 'Night search flight',
  case: 'Inspection flight along a transmission line corridor',
  disaster: 'Drone carrying aid over a damaged road in a disaster area',
  join: 'Engineers and entrepreneurs working together in the workshop',
  'cta-bg': 'Platform ready for take-off at dusk',
  'areas-hero': 'Wide-angle field view of a spray flight over farmland',
  'tech-hero': 'Close-up of the platform with its sensor payload visible',
  'contact-hero': 'The DroneTek team briefing in the field',
  software: 'Ground control station screen with a processed map output',
  'contact-office': 'The DroneTek office',
  'platform-shot': 'Field photograph of the selected flight platform',
};

const maps: Record<Locale, AltMap> = { tr, en };

export function photoAlt(locale: Locale, slot: SlotId): string {
  return maps[locale][slot] ?? '';
}
