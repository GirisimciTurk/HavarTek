'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import logoWhite from '@/assets/logo-white.png';
import { cn } from '@/lib/cn';
import {
  href,
  isLocale,
  locales,
  otherLocale,
  pageHref,
  resolveRoute,
  type Locale,
} from '@/lib/i18n';

type NavLabels = {
  home: string;
  areas: string;
  tech: string;
  contact: string;
};

type Props = {
  locale: Locale;
  nav: NavLabels;
  model3dLabel: string;
  ctaLabel: string;
  menuLabel: string;
  closeLabel: string;
};

const navOrder: Array<keyof NavLabels> = ['home', 'areas', 'tech', 'contact'];

/** "/tr/kullanim-alanlari" → { locale:'tr', segments:['kullanim-alanlari'] } */
function splitPath(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  const first = parts[0] ?? '';
  if (isLocale(first)) return { locale: first, segments: parts.slice(1) };
  return { locale: null, segments: parts };
}

export function SiteHeader({ locale, nav, model3dLabel, ctaLabel, menuLabel, closeLabel }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<keyof NavLabels | null>(null);

  // Menü açıkken arka planın kaymasını engelle
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const { segments } = splitPath(pathname);
  const current = resolveRoute(locale, segments);
  const activeKey: keyof NavLabels | null =
    current && current.kind !== 'doc' && current.kind !== 'model3d' ? current.kind : null;

  /** Aynı sayfanın diğer dildeki adresi; çözümlenemezse o dilin ana sayfası. */
  const localeHref = (target: Locale) => {
    const route = current ?? null;
    return route ? href(target, route) : `/${target}`;
  };

  const isModel3d = current?.kind === 'model3d';

  const navLinks = navOrder.map((key) => {
    const active = activeKey === key;
    const marked = hovered ? hovered === key : active;
    return { key, active, marked, label: nav[key], to: pageHref(locale, key) };
  });

  return (
    <header className="sticky top-0 z-30 border-b border-paper/12 bg-ink/86 backdrop-blur-[14px]">
      <div className="flex flex-wrap items-center gap-x-7 gap-y-3 px-[clamp(20px,4vw,64px)] py-4">
        <Link
          href={pageHref(locale, 'home')}
          className="mr-auto flex items-center gap-2.5 text-paper hover:text-paper"
          aria-label="DroneTek"
        >
          <Image src={logoWhite} alt="" height={22} className="h-[22px] w-auto" priority />
          <span className="font-display text-[21px] font-extrabold tracking-[-0.02em]">
            Drone<span className="text-amber">Tek</span>
          </span>
        </Link>

        {/* Masaüstü menüsü */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label={nav.home}>
          {navLinks.map(({ key, active, marked, label, to }) => (
            <span
              key={key}
              className="relative flex items-center"
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
            >
              <Image
                src={logoWhite}
                alt=""
                aria-hidden
                height={8}
                className="pointer-events-none absolute -top-[15px] left-1/2 -ml-2 h-2 w-auto transition-[opacity,transform] duration-300 ease-[cubic-bezier(.22,.61,.36,1)] motion-safe:animate-[dtBob_2.6s_ease-in-out_infinite]"
                style={{ opacity: marked ? 1 : 0, transform: `translateY(${marked ? 0 : 5}px)` }}
              />
              <Link
                href={to}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'whitespace-nowrap text-[15px] text-paper transition-opacity duration-200 hover:text-paper',
                  active || hovered === key ? 'opacity-100' : 'opacity-[.72]',
                )}
              >
                {label}
              </Link>
            </span>
          ))}

          <Link
            href={pageHref(locale, 'model3d')}
            aria-current={isModel3d ? 'page' : undefined}
            className={cn(
              'whitespace-nowrap text-[15px] text-paper hover:text-paper hover:opacity-100',
              isModel3d ? 'opacity-100' : 'opacity-[.72]',
            )}
          >
            {model3dLabel}
          </Link>
        </nav>

        <LocaleSwitch locale={locale} localeHref={localeHref} />

        <Link
          href={pageHref(locale, 'contact')}
          className="hidden rounded-full bg-amber px-5 py-[11px] text-[14px] font-medium text-ink transition-colors hover:bg-amber-lift hover:text-ink sm:inline-flex"
        >
          {ctaLabel}
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label={menuOpen ? closeLabel : menuLabel}
          className="inline-flex items-center gap-2 rounded-full border border-paper/24 px-3 py-2.5 text-[14px] text-paper transition-colors hover:bg-paper/10 sm:px-4 sm:py-2 lg:hidden"
        >
          <span
            aria-hidden
            className="relative flex h-3 w-4 flex-col justify-between"
          >
            <span
              className={cn(
                'block h-px w-full bg-current transition-transform duration-200',
                menuOpen && 'translate-y-[5.5px] rotate-45',
              )}
            />
            <span
              className={cn('block h-px w-full bg-current transition-opacity', menuOpen && 'opacity-0')}
            />
            <span
              className={cn(
                'block h-px w-full bg-current transition-transform duration-200',
                menuOpen && '-translate-y-[5.5px] -rotate-45',
              )}
            />
          </span>
          {/* Etiket dar ekranda gizli: logo + dil + düğme tek satıra sığsın. */}
          <span className="hidden sm:inline">{menuOpen ? closeLabel : menuLabel}</span>
        </button>
      </div>

      {/* Mobil menü */}
      <div
        id="site-menu"
        hidden={!menuOpen}
        className="border-t border-paper/12 bg-ink px-[clamp(20px,4vw,64px)] pb-6 pt-2 lg:hidden"
      >
        {/* Bağlantıya tıklanınca menü kapanır — gezinme sonrası açık kalmasın. */}
        <nav className="flex flex-col" onClick={() => setMenuOpen(false)}>
          {navLinks.map(({ key, active, label, to }) => (
            <Link
              key={key}
              href={to}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'border-b border-paper/12 py-4 font-display text-[19px] font-semibold tracking-[-0.015em] text-paper hover:text-amber',
                active && 'text-amber',
              )}
            >
              {label}
            </Link>
          ))}
          <Link
            href={pageHref(locale, 'model3d')}
            aria-current={isModel3d ? 'page' : undefined}
            className={cn(
              'border-b border-paper/12 py-4 font-display text-[19px] font-semibold tracking-[-0.015em] text-paper hover:text-amber',
              isModel3d && 'text-amber',
            )}
          >
            {model3dLabel}
          </Link>
          <Link
            href={pageHref(locale, 'contact')}
            className="mt-6 inline-flex justify-center rounded-full bg-amber px-6 py-[13px] text-[15px] font-medium text-ink hover:bg-amber-lift hover:text-ink sm:hidden"
          >
            {ctaLabel}
          </Link>
        </nav>
      </div>
    </header>
  );
}

function LocaleSwitch({
  locale,
  localeHref,
}: {
  locale: Locale;
  localeHref: (target: Locale) => string;
}) {
  return (
    <div className="flex gap-0.5 rounded-full border border-paper/18 p-[3px]">
      {locales.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={localeHref(code)}
            hrefLang={code}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'rounded-full px-[11px] py-[5px] text-[12px] font-medium tracking-[0.08em] transition-colors',
              active
                ? 'bg-amber text-ink hover:text-ink'
                : 'bg-transparent text-paper/70 hover:bg-paper/10 hover:text-paper',
            )}
          >
            {code.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}

export { otherLocale };
