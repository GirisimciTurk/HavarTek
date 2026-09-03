import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/lib/cn';

/* -------------------------------------------------------------------------
   Tipografi — tasarımdaki başlık ölçekleri
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
  bold: 'font-display font-extrabold leading-[1.14] tracking-[-0.03em]',
  boldTight: 'font-display font-extrabold leading-[1.14] tracking-[-0.035em]',
  semi: 'font-display font-semibold tracking-[-0.015em]',
  stat: 'font-display font-extrabold leading-none tnum',
} as const;

/**
 * Sık kullanılan başlık ölçekleri. Puntosunu değiştirmen gereken yerde bunları
 * KULLANMA — `face.*` + kendi `text-[...]` değerini yaz.
 */
export const display = {
  // Alt sınır tasarımda 44px'ti; dar telefonlarda manşet 6 satıra çıkıp alt
  // metni ekran dışına ittiği için 34px'e çekildi (600px üstünde değişiklik yok).
  hero: 'font-display font-extrabold text-[clamp(34px,7.4vw,104px)] leading-[1.14] tracking-[-0.035em]',
  page: 'font-display font-extrabold text-[clamp(36px,6vw,84px)] leading-[1.14] tracking-[-0.035em]',
  section: 'font-display font-extrabold text-[clamp(28px,3.6vw,48px)] leading-[1.14] tracking-[-0.03em]',
  sectionSm: 'font-display font-extrabold text-[clamp(26px,3vw,42px)] leading-[1.14] tracking-[-0.03em]',
  card: 'font-display font-semibold text-[21px] leading-[26px] tracking-[-0.015em]',
  cardSm: 'font-display font-semibold text-[19px] leading-[24px] tracking-[-0.015em]',
  stat: 'font-display font-extrabold leading-none tracking-[-0.035em] tnum',
} as const;

/* -------------------------------------------------------------------------
   Düğmeler — hepsi hap biçimli (border-radius:999px)
------------------------------------------------------------------------- */

const buttonBase =
  'inline-flex cursor-pointer items-center justify-center rounded-full text-center font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60';

export const buttonStyles = {
  primary: cn(buttonBase, 'border-0 bg-amber text-ink hover:bg-amber-lift'),
  ghost: cn(
    buttonBase,
    'border border-paper/34 bg-transparent text-paper hover:bg-paper/10 hover:text-paper',
  ),
  outline: cn(
    buttonBase,
    'border border-paper/24 bg-transparent text-paper hover:bg-paper/10 hover:text-paper',
  ),
} as const;

export const buttonSizes = {
  lg: 'px-[26px] py-[14px] text-[15px]',
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
   Filtre etiketi (kategori / platform seçimi)
------------------------------------------------------------------------- */

export function chipClass(active: boolean): string {
  return cn(
    'cursor-pointer rounded-full border px-4 py-[9px] text-[14px] transition-colors',
    active
      ? 'border-amber bg-amber text-ink'
      : 'border-paper/24 bg-transparent text-paper/78 hover:border-paper/40 hover:text-paper',
  );
}

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
            'border-t border-paper/14 py-[18px] text-[17px] leading-[26px]',
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
        <p className="m-0 mt-6 max-w-[58ch] text-[17px] leading-[28px] text-paper/76">{lead}</p>
      ) : null}
    </div>
  );
}
