/**
 * Fotoğraf kataloğu.
 *
 * Tasarımdaki ("HavarTek Aydınlık Tema.dc.html") her fotoğraf yuvası burada
 * gerçek dosyayla eşleşiyor. Tasarım projesinde yalnızca altı fotoğraf vardı
 * ve bazıları yan yana bölümlerde tekrar ediyordu; o yuvalara (mission-0/2,
 * step-0, why-air) depodaki konuyla eşleşen fotoğraflar verildi.
 *
 * Statik import kullanılıyor; böylece next/image genişlik/yükseklik ve
 * bulanık (blur) ön izlemeyi kendisi üretiyor.
 */
import type { StaticImageData } from 'next/image';

import gece from '@/assets/photos/gece.jpeg';
import geminiCity from '@/assets/photos/gemini-city.jpeg';
import gorev1 from '@/assets/photos/gorev1.jpeg';
import heroSplit from '@/assets/photos/hero-split.jpeg';
import iha from '@/assets/photos/iha.jpeg';
import ihatamir from '@/assets/photos/ihatamir.jpeg';
import ist from '@/assets/photos/ist.jpeg';
import kablo from '@/assets/photos/kablo.jpeg';
import kargo from '@/assets/photos/kargo.jpeg';
import konyasaha from '@/assets/photos/konyasaha.jpeg';
import niceiha from '@/assets/photos/niceiha.jpeg';
import rgb from '@/assets/photos/rgb.jpeg';
import sensor from '@/assets/photos/sensor.jpeg';
import sistem2 from '@/assets/photos/sistem_2.jpeg';
import sistemGelistir from '@/assets/photos/sistem_gelistir.jpeg';
import termal from '@/assets/photos/termal.jpeg';
import vk4 from '@/assets/photos/vk4.jpeg';
import vk7 from '@/assets/photos/vk7.jpeg';
import vtol from '@/assets/photos/vtol.jpeg';

export type SlotId =
  | 'hero'
  | 'promise-bg'
  | 'mission-0' | 'mission-1' | 'mission-2'
  | 'area-0' | 'area-1' | 'area-2' | 'area-3'
  | 'area-detail-0' | 'area-detail-1' | 'area-detail-2' | 'area-detail-3'
  | 'step-0' | 'step-1' | 'step-2' | 'step-3'
  | 'stories' | 'why-air' | 'request-bg'
  | 'areas-hero' | 'tech-hero' | 'not-found'
  | 'plat-0' | 'plat-1' | 'plat-2'
  | 'payload-0' | 'payload-1' | 'payload-2' | 'payload-3'
  | 'software';

export const photos: Record<SlotId, StaticImageData> = {
  /** Manşet: solda dumanlı kara yolu trafiği, sağda kargo taşıyan drone. */
  hero: heroSplit,

  'promise-bg': niceiha,

  'mission-0': sistemGelistir,
  'mission-1': geminiCity,
  'mission-2': ihatamir,

  // Kullanım alanları — sıra site.json içindeki `areas` dizisiyle aynı
  'area-0': kargo,
  'area-1': geminiCity,
  'area-2': gece,
  'area-3': niceiha,

  'area-detail-0': kargo,
  'area-detail-1': geminiCity,
  'area-detail-2': gece,
  'area-detail-3': niceiha,

  'step-0': gorev1,
  'step-1': vk7,
  'step-2': niceiha,
  'step-3': kargo,

  stories: gece,
  'why-air': sistem2,
  'request-bg': niceiha,

  'areas-hero': iha,
  'tech-hero': vtol,
  'not-found': konyasaha,

  'plat-0': vk4,
  'plat-1': vk7,
  'plat-2': vtol,

  'payload-0': rgb,
  'payload-1': sensor,
  'payload-2': termal,
  'payload-3': kablo,

  software: ist,
};

/** Çerçeve içinde kaydırılmış kırpma gereken yuvalar (`object-position`). */
export const objectPosition: Partial<Record<SlotId, string>> = {};

/** Sosyal paylaşım görseli ve genel kapak için kullanılan kare. */
export const coverPhoto = heroSplit;
