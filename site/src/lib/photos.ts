/**
 * Fotoğraf kataloğu.
 *
 * Tasarımdaki her `image-slot` kimliği burada gerçek fotoğrafla eşleşiyor.
 * Eşleme tahmin değil: tasarım dosyasının `.image-slots.state.json` içinde
 * gömülü olan görseller çıkarılıp `assets/photos/` altındaki orijinallerle
 * algısal karma (perceptual hash) ile birebir eşleştirildi.
 *
 * Statik import kullanılıyor; böylece next/image genişlik/yükseklik ve
 * bulanık (blur) ön izlemeyi kendisi üretiyor.
 */
import type { StaticImageData } from 'next/image';

import buildandmine from '@/assets/photos/buildandmine.jpeg';
import forest from '@/assets/photos/forest-observsing.jpeg';
import gece from '@/assets/photos/gece.jpeg';
import geminiCity from '@/assets/photos/gemini-city.jpeg';
import gorev1 from '@/assets/photos/gorev1.jpeg';
import gorev2 from '@/assets/photos/gorev2.jpeg';
import gorev3 from '@/assets/photos/gorev3.jpeg';
import iha from '@/assets/photos/iha.jpeg';
import ihatamir from '@/assets/photos/ihatamir.jpeg';
import isletme from '@/assets/photos/isletme.jpeg';
import ist from '@/assets/photos/ist.jpeg';
import ist2 from '@/assets/photos/ist2.jpeg';
import kablo from '@/assets/photos/kablo.jpeg';
import kargo from '@/assets/photos/kargo.jpeg';
import konyasaha from '@/assets/photos/konyasaha.jpeg';
import niceiha from '@/assets/photos/niceiha.jpeg';
import rgb from '@/assets/photos/rgb.jpeg';
import sec from '@/assets/photos/sec.jpeg';
import sensor from '@/assets/photos/sensor.jpeg';
import sistem2 from '@/assets/photos/sistem_2.jpeg';
import sistemGelistir from '@/assets/photos/sistem_gelistir.jpeg';
import tarim from '@/assets/photos/tarim.jpeg';
import termal from '@/assets/photos/termal.jpeg';
import veri from '@/assets/photos/veri.jpeg';
import vk4 from '@/assets/photos/vk4.jpeg';
import vk7 from '@/assets/photos/vk7.jpeg';
import vtol from '@/assets/photos/vtol.jpeg';

export type SlotId =
  | 'hero'
  | 'mosaic-0' | 'mosaic-1' | 'mosaic-2' | 'mosaic-3' | 'mosaic-4'
  | 'stats-bg'
  | 'mission-0' | 'mission-1' | 'mission-2'
  | 'area-0' | 'area-1' | 'area-2' | 'area-3' | 'area-4' | 'area-5' | 'area-6' | 'area-7'
  | 'area-detail-0' | 'area-detail-1' | 'area-detail-2' | 'area-detail-3'
  | 'area-detail-4' | 'area-detail-5' | 'area-detail-6' | 'area-detail-7'
  | 'platform-shot'
  | 'step-0' | 'step-1' | 'step-2' | 'step-3'
  | 'case' | 'disaster' | 'join' | 'cta-bg'
  | 'news-0' | 'news-1' | 'news-2'
  | 'areas-hero' | 'tech-hero' | 'contact-hero'
  | 'plat-0' | 'plat-1' | 'plat-2'
  | 'payload-0' | 'payload-1' | 'payload-2' | 'payload-3'
  | 'software' | 'contact-office';

export const photos: Record<SlotId, StaticImageData> = {
  hero: geminiCity,

  'mosaic-0': tarim,
  'mosaic-1': termal,
  'mosaic-2': ist2,
  'mosaic-3': kargo,
  'mosaic-4': gece,

  'stats-bg': niceiha,

  'mission-0': sistemGelistir,
  'mission-1': geminiCity,
  'mission-2': ist2,

  // Kullanım alanları — sıra site.json içindeki `areas` dizisiyle aynı
  'area-0': tarim,
  'area-1': geminiCity,
  'area-2': termal,
  'area-3': gece,
  'area-4': kargo,
  'area-5': buildandmine,
  'area-6': sec,
  'area-7': forest,

  'area-detail-0': tarim,
  'area-detail-1': sistem2,
  'area-detail-2': termal,
  'area-detail-3': gece,
  'area-detail-4': kargo,
  'area-detail-5': buildandmine,
  'area-detail-6': sec,
  'area-detail-7': forest,

  'platform-shot': niceiha,

  'step-0': gorev1,
  'step-1': gorev2,
  'step-2': gorev3,
  'step-3': isletme,

  case: termal,
  disaster: gece,
  join: ihatamir,
  'cta-bg': niceiha,

  'news-0': vtol,
  'news-1': konyasaha,
  'news-2': veri,

  'areas-hero': niceiha,
  'tech-hero': iha,
  'contact-hero': isletme,

  'plat-0': vk4,
  'plat-1': vk7,
  'plat-2': vtol,

  'payload-0': rgb,
  'payload-1': sensor,
  'payload-2': termal,
  'payload-3': kablo,

  software: ist,
  'contact-office': ist,
};

/**
 * Tasarımda çerçeve içinde kaydırılmış iki görsel var; kırpma merkezini
 * `object-position` ile birebir aynı yere taşıyoruz.
 */
export const objectPosition: Partial<Record<SlotId, string>> = {
  'mosaic-0': '78% 50%',
  'mosaic-2': '100% 50%',
};

/** Platform seçimine göre değişen fotoğraf (ana sayfadaki teknik veri bloğu). */
export const platformPhoto: Record<string, StaticImageData> = {
  'VK-4': vk4,
  'VK-7': vk7,
  'VK-9': vtol,
};

/** Sosyal paylaşım görseli ve genel kapak için kullanılan kare. */
export const coverPhoto = geminiCity;
