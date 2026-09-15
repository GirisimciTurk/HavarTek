'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import logo from '@/assets/havartek-logo.webp';
import { ButtonLink } from '@/components/ui';
import { cn } from '@/lib/cn';
import { href, isLocale, locales, pageHref, resolveRoute, type Locale } from '@/lib/i18n';

type NavLabels = {
  home: string;
  areas: string;
  tech: string;
  contact: string;
};

type Props = {
  locale: Locale;
  nav: NavLabels;
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

/**
 * Yüzen hap menü. Tasarımdaki gibi akışta 0 yükseklik kaplar; her sayfanın
 * ilk bölümü içeriğini menünün altından kurtaracak üst boşluğu kendisi taşır.
 */
export function SiteHeader({ locale, nav, ctaLabel, menuLabel, closeLabel }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<keyof NavLabels | null>(null);

  // Tasarımdaki gibi: pencere masaüstü eşiğini (lg = 1024px) geçince mobil
  // menü kapanır; aksi halde gizlenen panel açık kalır. Sayfa kaydırması
  // kilitlenmez — panel yüzen menünün altında akar.
  useEffect(() => {
    if (!menuOpen) return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    const close = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    close();
    desktop.addEventListener('change', close);
    return () => desktop.removeEventListener('change', close);
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

  const navLinks = navOrder.map((key) => {
    const active = activeKey === key;
    // Drone işareti: hover varsa hover'daki öğede, yoksa aktif sayfada durur.
    const marked = hovered ? hovered === key : active;
    return { key, active, marked, label: nav[key], to: pageHref(locale, key) };
  });

  return (
    <header className="sticky top-[14px] z-30 h-0 px-[clamp(14px,3vw,40px)] pt-[14px]">
      <div className="mx-auto flex w-full max-w-[1320px] flex-wrap items-center gap-x-7 gap-y-3 rounded-[20px] border border-line bg-ground/90 px-[clamp(16px,2vw,26px)] py-3 shadow-float backdrop-blur-[14px]">
        <Link
          href={pageHref(locale, 'home')}
          className="mr-auto flex flex-none items-center"
          aria-label="HavarTek.com"
        >
          <Image src={logo} alt="" height={50} className="block h-[50px] w-auto" priority />
        </Link>

        {/* Masaüstü menüsü */}
        <nav className="hidden items-center gap-[26px] lg:flex">
          {navLinks.map(({ key, active, marked, label, to }) => (
            <span
              key={key}
              className="relative flex items-center"
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* 28×12 kutu logonun üst kısmını (drone işaretini) gösterir. */}
              <span
                aria-hidden
                className={cn(
                  'pointer-events-none absolute -top-[15px] left-1/2 -ml-3.5 h-3 w-7 overflow-hidden transition-[opacity,transform] duration-300 ease-out-soft',
                  marked && 'animate-[dtBob_2.6s_ease-in-out_infinite]',
                )}
                style={{ opacity: marked ? 1 : 0, transform: `translateY(${marked ? 0 : 5}px)` }}
              >
                <Image src={logo} alt="" width={28} className="block w-7" />
              </span>
              <Link
                href={to}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'whitespace-nowrap text-[15px] transition-colors',
                  active ? 'font-medium text-ink hover:text-ink' : 'text-muted hover:text-ink',
                )}
              >
                {label}
              </Link>
            </span>
          ))}
        </nav>

        <LocaleSwitch locale={locale} localeHref={localeHref} />

        {/* Masaüstü CTA; mobilde menü panelinin altında */}
        <Link
          href={pageHref(locale, 'contact')}
          className="hidden flex-none whitespace-nowrap rounded-full bg-blue px-5 py-[11px] text-[14px] font-medium text-white transition-colors hover:bg-blue-lift hover:text-white lg:inline-flex"
        >
          {ctaLabel}
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label={menuOpen ? closeLabel : menuLabel}
          className="inline-flex flex-none cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-white px-3.5 py-[9px] text-[14px] text-ink transition-colors hover:bg-tint lg:hidden"
        >
          <span aria-hidden className="relative flex h-3 w-4 flex-col justify-between">
            <span
              className={cn(
                'block h-px w-full bg-current transition-transform duration-200',
                menuOpen && 'translate-y-[5.5px] rotate-45',
              )}
            />
            <span
              className={cn(
                'block h-px w-full bg-current transition-opacity duration-200',
                menuOpen && 'opacity-0',
              )}
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

      {/* Mobil menü — hapın altında ikinci bir yüzen panel */}
      <div
        id="site-menu"
        hidden={!menuOpen}
        className="mx-auto mt-2 w-full max-w-[1320px] rounded-[20px] border border-line bg-ground/96 px-[clamp(18px,3vw,26px)] pb-[22px] pt-2 shadow-float backdrop-blur-[14px] lg:hidden"
      >
        {/* Bağlantıya tıklanınca menü kapanır — gezinme sonrası açık kalmasın. */}
        <nav className="flex flex-col" onClick={() => setMenuOpen(false)}>
          {navLinks.map(({ key, active, label, to }) => (
            <Link
              key={key}
              href={to}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'border-b border-line py-4 font-display text-[19px] font-semibold tracking-[-0.015em] transition-colors',
                active ? 'text-blue' : 'text-ink hover:text-blue',
              )}
            >
              {label}
            </Link>
          ))}
          <ButtonLink href={pageHref(locale, 'contact')} className="mt-6">
            {ctaLabel}
          </ButtonLink>
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
    <div className="flex flex-none gap-0.5 rounded-full border border-line-strong bg-white p-[3px]">
      {locales.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={localeHref(code)}
            hrefLang={code}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'rounded-full px-[11px] py-[5px] text-[12px] font-semibold tracking-[0.08em] transition-colors',
              active ? 'bg-blue text-white hover:text-white' : 'text-muted hover:bg-tint hover:text-ink',
            )}
          >
            {code.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
