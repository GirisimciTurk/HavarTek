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
 * Tasarımdaki `<image-slot>` karşılığı. Her zaman `fill` ile çalışır; ölçüyü
 * saran kap belirler (bkz. `Frame`).
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

/** Sabit en-boy oranlı, taşmayı kırpan fotoğraf kabı. */
export function Frame({ ratio, className, style, children }: FrameProps) {
  return (
    <div
      className={cn('relative w-full overflow-hidden bg-surface', className)}
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
 * Fotoğrafın üzerine binen koyu geçiş katmanı. Tasarımdaki her bölümün kendi
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

/** Tasarımda tekrar eden gradyanlar. */
export const scrims = {
  hero:
    'linear-gradient(180deg,rgba(11,13,15,.6) 0%,rgba(11,13,15,.4) 34%,rgba(11,13,15,.86) 72%,rgba(11,13,15,.97) 100%)',
  stats:
    'linear-gradient(180deg,rgba(11,13,15,.82) 0%,rgba(11,13,15,.62) 50%,rgba(11,13,15,.9) 100%)',
  card:
    'linear-gradient(180deg,rgba(11,13,15,0) 0%,rgba(11,13,15,.18) 34%,rgba(11,13,15,.82) 62%,rgba(11,13,15,.97) 100%)',
  sideways:
    'linear-gradient(90deg,rgba(11,13,15,.94) 0%,rgba(11,13,15,.72) 46%,rgba(11,13,15,.35) 100%)',
  disaster:
    'linear-gradient(180deg,rgba(11,13,15,.3) 0%,rgba(11,13,15,.72) 55%,rgba(11,13,15,.95) 100%)',
  cta:
    'linear-gradient(180deg,rgba(11,13,15,.35) 0%,rgba(11,13,15,.8) 62%,rgba(11,13,15,.96) 100%)',
  pageHeader:
    'linear-gradient(180deg,rgba(11,13,15,.45) 0%,rgba(11,13,15,.92) 100%)',
  pageHeaderSoft:
    'linear-gradient(180deg,rgba(11,13,15,.4) 0%,rgba(11,13,15,.9) 100%)',
  contactHeader:
    'linear-gradient(180deg,rgba(11,13,15,.3) 0%,rgba(11,13,15,.92) 100%)',
} as const;
