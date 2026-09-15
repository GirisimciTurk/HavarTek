import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import '@/app/globals.css';

import { CookieConsent } from '@/components/CookieConsent';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { getDictionary } from '@/content';
import { getUi } from '@/content/ui';
import { docHref, htmlLang, isLocale, locales, type Locale } from '@/lib/i18n';
import { organizationJsonLd, siteUrl } from '@/lib/site';

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#F4F7FB',
  colorScheme: 'light',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'tr';
  const ui = getUi(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: ui.siteName,
    description: ui.metaDescription,
    applicationName: ui.siteName,
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      ],
      apple: '/apple-icon.png',
    },
    manifest: '/manifest.webmanifest',
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const t = getDictionary(locale);
  const ui = getUi(locale);

  return (
    <html lang={htmlLang[locale]} className={poppins.variable} data-scroll-behavior="smooth">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-blue focus:px-5 focus:py-3 focus:text-[15px] focus:font-medium focus:text-white"
        >
          {ui.skipToContent}
        </a>

        <SiteHeader
          locale={locale}
          nav={t.nav}
          ctaLabel={t.cta}
          menuLabel={ui.menu}
          closeLabel={ui.close}
        />

        <main id="main">{children}</main>

        <SiteFooter locale={locale} />
        <CookieConsent
          strings={{
            barTitle: t.ck.barTitle,
            barBody: t.ck.barBody,
            manage: t.ck.manage,
            reject: t.ck.reject,
            accept: t.ck.accept,
            panelTitle: t.ck.panelTitle,
            save: t.ck.save,
            close: t.ck.close,
            locked: t.ck.locked,
            on: locale === 'en' ? 'On' : 'Açık',
            off: locale === 'en' ? 'Off' : 'Kapalı',
            cats: t.ck.cats,
            policyLabel: t.docs.cerez.t,
            policyHref: docHref(locale, 'cerez'),
          }}
        />

        <script
          type="application/ld+json"
          // Yapılandırılmış veri; içerik kendi kaynağımızdan geliyor.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(locale)) }}
        />
      </body>
    </html>
  );
}
