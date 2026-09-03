import { NextResponse, type NextRequest } from 'next/server';

import { defaultLocale, isLocale, LOCALE_HEADER, locales } from '@/lib/i18n';

/**
 * Her adres bir dil ön ekiyle başlar (/tr, /en). Ön eki olmayan istekler
 * tarayıcı diline göre yönlendirilir; böylece 404 sayfası da dil düzeninin
 * içinde kalır ve ayrı bir kök yerleşime gerek olmaz.
 */
function pickLocale(request: NextRequest) {
  const header = request.headers.get('accept-language');
  if (!header) return defaultLocale;

  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=');
      return { tag: (tag ?? '').toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split('-')[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split('/').filter(Boolean)[0];

  if (first && isLocale(first)) {
    // 404 sınırı `params` alamıyor; dili başlıkla taşıyoruz (bkz. not-found.tsx).
    const headers = new Headers(request.headers);
    headers.set(LOCALE_HEADER, first);
    return NextResponse.next({ request: { headers } });
  }

  const locale = pickLocale(request);
  const rest = pathname === '/' ? '' : pathname;
  return NextResponse.redirect(new URL(`/${locale}${rest}${search}`, request.url));
}

export const config = {
  /**
   * API uçları, Next varlıkları ve public altındaki dosyalar dışında her şey.
   *
   * Kök seviyedeki üst veri rotaları da dışarıda kalmalı: /opengraph-image
   * uzantısız olduğu için aksi hâlde /tr/opengraph-image'a yönlenir ve sosyal
   * paylaşım görseli 404 döner. Nokta içeren yollar (robots.txt, sitemap.xml,
   * favicon.ico, manifest.webmanifest) zaten kalıbın dışında.
   */
  matcher: ['/((?!api|_next|opengraph-image$|twitter-image$|icon$|apple-icon$|.*\\..*).*)'],
};

export { locales };
