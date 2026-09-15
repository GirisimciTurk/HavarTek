import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { objectPosition, photos, type SlotId } from '@/lib/photos';

type PhotoProps = {
  slot: SlotId;
  alt: string;
  /** next/image `sizes` — fotoğraf ağırlıklı sayfada doğru dosyanın inmesi için zorunlu. */
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Tasarımdaki kaydırılmış kırpma için `object-position` ezmesi. */
  position?: string;
};

/**
 * Tasarımdaki tam kaplayan `<img>` karşılığı. Her zaman `fill` ile çalışır;
 * ölçüyü saran kap belirler (bkz. `Frame`).
 */
export function Photo({ slot, alt, sizes, priority, className, position }: PhotoProps) {
  return (
    <Image
      src={photos[slot]}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      className={cn('object-cover', className)}
      style={{ objectPosition: position ?? objectPosition[slot] ?? '50% 50%' }}
    />
  );
}

type FrameProps = {
  /** "4/3", "16/9", "3/4" … */
  ratio: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/** Sabit en-boy oranlı, taşmayı kırpan fotoğraf kabı. Zemin tasarımdaki #E4EDF8. */
export function Frame({ ratio, className, style, children }: FrameProps) {
  return (
    <div
      className={cn('relative w-full overflow-hidden bg-tint', className)}
      style={{ aspectRatio: ratio, ...style }}
    >
      {children}
    </div>
  );
}

type PhotoFrameProps = PhotoProps & { ratio: string; frameClassName?: string };

/** `Frame` + `Photo` — kart görselleri için kısayol. */
export function PhotoFrame({ ratio, frameClassName, ...photo }: PhotoFrameProps) {
  return (
    <Frame ratio={ratio} className={frameClassName}>
      <Photo {...photo} />
    </Frame>
  );
}

/**
 * Fotoğrafın üzerine binen geçiş katmanı. Tasarımdaki her bölümün kendi
 * gradyanı olduğu için değer dışarıdan veriliyor.
 */
export function Scrim({ gradient, className }: { gradient: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{ background: gradient }}
    />
  );
}

/** Tasarımda tekrar eden gradyanlar ("HavarTek Aydınlık Tema.dc.html"). */
export const scrims = {
  /** Vaadimiz şeridi: lacivert, fotoğraf %30 opaklıkla altta kalır. */
  promise:
    'linear-gradient(180deg,rgba(8,32,63,.82) 0%,rgba(8,32,63,.66) 50%,rgba(8,32,63,.92) 100%)',
  /** Kullanım alanı kartı: alttan beyaza dönen perde, metin fotoğrafın üstünde. */
  areaCard:
    'linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.08) 34%,rgba(255,255,255,.62) 62%,rgba(255,255,255,.88) 100%)',
  /** "Neden hava yolu": soldan gelen açık zemin, fotoğraf sağda görünür. */
  sideways:
    'linear-gradient(90deg,rgba(244,247,251,.985) 0%,rgba(244,247,251,.88) 46%,rgba(244,247,251,.35) 100%)',
  /** Talep bölümü: üstten alta açık zemine kaybolan fotoğraf. */
  request:
    'linear-gradient(180deg,rgba(244,247,251,.82) 0%,rgba(244,247,251,.94) 55%,rgba(244,247,251,.99) 100%)',
  /** Alt sayfa manşetleri (koyu şerit, açık yazı) — Vaadimiz şeridinin türevi. */
  pageHeader:
    'linear-gradient(180deg,rgba(8,32,63,.55) 0%,rgba(8,32,63,.72) 55%,rgba(8,32,63,.92) 100%)',
} as const;
