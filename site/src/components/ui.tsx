import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/lib/cn';

/* -------------------------------------------------------------------------
   Tipografi — tasarımdaki başlık ölçekleri (Poppins)
------------------------------------------------------------------------- */

/**
 * Başlık yüzleri — punto İÇERMEZ.
 *
 * Tailwind, aynı özelliğin iki keyfi değerini (ör. `text-[20px]` ve `text-[21px]`)
 * yazdığın sıraya göre değil, üretilen CSS'teki sıraya göre çözer; bu yüzden
 * hazır bir presetin puntosunu başka bir `text-[...]` ile ezmek sessizce
 * çalışmayabilir. Punto tasarımdan tasarıma değiştiği için yüz (aile/ağırlık/
 * satır yüksekliği/harf aralığı) ile punto ayrıldı: puntoyu her zaman kullanım
 * yerinde ver.
 */
export const face = {
  bold: 'font-display font-extrabold leading-[1.14] tracking-[-0.018em]',
  boldTight: 'font-display font-extrabold leading-[1.14] tracking-[-0.022em]',
  semi: 'font-display font-semibold tracking-[-0.015em]',
  stat: 'font-display font-extrabold leading-none tnum',
} as const;

/**
 * Sık kullanılan başlık ölçekleri. Puntosunu değiştirmen gereken yerde bunları
 * KULLANMA — `face.*` + kendi `text-[...]` değerini yaz.
 */
export const display = {
  hero: 'font-display font-extrabold text-[clamp(32px,4.4vw,60px)] leading-[1.14] tracking-[-0.022em]',
  page: 'font-display font-extrabold text-[clamp(34px,5vw,68px)] leading-[1.14] tracking-[-0.022em]',
  section: 'font-display font-extrabold text-[clamp(28px,3.6vw,48px)] leading-[1.14] tracking-[-0.018em]',
  sectionSm: 'font-display font-extrabold text-[clamp(26px,3vw,42px)] leading-[1.14] tracking-[-0.018em]',
  card: 'font-display font-semibold text-[21px] leading-[26px] tracking-[-0.015em]',
  cardSm: 'font-display font-semibold text-[19px] leading-[24px] tracking-[-0.015em]',
  stat: 'font-display font-extrabold leading-none tracking-[-0.022em] tnum',
} as const;

/* -------------------------------------------------------------------------
   Düğmeler — hepsi hap biçimli (border-radius:999px)
------------------------------------------------------------------------- */

const buttonBase =
  'inline-flex cursor-pointer items-center justify-center rounded-full text-center font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60';

export const buttonStyles = {
  /** Mavi dolgu, beyaz yazı — açık ve koyu zeminde aynı. */
  primary: cn(buttonBase, 'border-0 bg-blue text-white hover:bg-blue-lift hover:text-white'),
  /** Açık zeminde ikincil: beyaz dolgu, ince kenarlık. */
  ghost: cn(
    buttonBase,
    'border border-line-chip bg-white text-ink hover:bg-tint hover:text-ink',
  ),
  /** Koyu (navy) zeminde ikincil: saydam dolgu, açık kenarlık. */
  outline: cn(
    buttonBase,
    'border border-paper/26 bg-transparent text-paper hover:bg-paper/10 hover:text-white',
  ),
  /** Koyu zeminde birincil: açık dolgu, lacivert yazı (alt bilgi bülteni). */
  light: cn(buttonBase, 'border-0 bg-paper text-navy hover:bg-white hover:text-navy'),
} as const;

export const buttonSizes = {
  lg: 'px-6 py-[13px] text-[15px]',
  md: 'px-5 py-[11px] text-[14px]',
  sm: 'px-[14px] py-2 text-[14px]',
} as const;

type Variant = keyof typeof buttonStyles;
type Size = keyof typeof buttonSizes;

export function Button({
  variant = 'primary',
  size = 'lg',
  className,
  ...props
}: ComponentProps<'button'> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(buttonStyles[variant], buttonSizes[size], className)}
    />
  );
}

export function ButtonLink({
  variant = 'primary',
  size = 'lg',
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link {...props} className={cn(buttonStyles[variant], buttonSizes[size], className)} />;
}

/* -------------------------------------------------------------------------
   Filtre etiketi (kategori seçimi)
------------------------------------------------------------------------- */

export function chipClass(active: boolean): string {
  return cn(
    'cursor-pointer rounded-full border px-4 py-[9px] text-[14px] transition-colors',
    active
      ? 'border-blue bg-blue text-white hover:text-white'
      : 'border-line-strong bg-white text-muted hover:border-line-chip hover:text-ink',
  );
}

/* -------------------------------------------------------------------------
   Kart — beyaz zemin, ince kenarlık, yuvarlatılmış köşe
------------------------------------------------------------------------- */

/** Tasarımdaki beyaz kartın ortak sınıfları; hover'da 5px yükselir. */
export const cardClass =
  'rounded-2xl border border-line-soft bg-white transition-[transform,box-shadow] duration-[350ms] ease-out-soft hover:-translate-y-[5px] hover:shadow-card';

/* -------------------------------------------------------------------------
   Üst çizgili liste — tasarımda tekrar eden madde listesi
------------------------------------------------------------------------- */

export function RuledList({
  items,
  className,
  itemClassName,
}: {
  items: readonly string[];
  className?: string;
  itemClassName?: string;
}) {
  return (
    <ul className={cn('m-0 flex list-none flex-col p-0', className)}>
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            'border-t border-line py-[18px] text-[17px] leading-[26px] text-slate',
            itemClassName,
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------
   Bölüm başlığı
------------------------------------------------------------------------- */

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('kicker rise mb-[18px]', className)}>{children}</span>;
}

export function SectionHeading({
  kicker,
  title,
  lead,
  as: Tag = 'h2',
  titleClassName,
  className,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  as?: 'h1' | 'h2';
  titleClassName?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {kicker ? <Kicker>{kicker}</Kicker> : null}
      <Tag className={cn(display.section, 'rise m-0', titleClassName)}>{title}</Tag>
      {lead ? (
        <p className="m-0 mt-5 max-w-[64ch] text-[16px] leading-[27px] text-muted">{lead}</p>
      ) : null}
    </div>
  );
}
