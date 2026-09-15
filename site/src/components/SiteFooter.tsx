import Image from 'next/image';
import Link from 'next/link';

import logo from '@/assets/havartek-logo.webp';
import { CookiePreferencesButton } from '@/components/CookieConsent';
import { NewsletterForm } from '@/components/NewsletterForm';
import { getDictionary } from '@/content';
import { getUi } from '@/content/ui';
import {
  categoryParam,
  docHref,
  legalDocKeys,
  pageHref,
  supportDocKeys,
  type Locale,
} from '@/lib/i18n';
import { ORG } from '@/lib/site';

function whatsappHref(locale: Locale): string {
  const text =
    locale === 'en'
      ? 'Hello, I would like information about drone-based transport systems.'
      : 'Merhaba, drone tabanlı ulaşım sistemleri hakkında bilgi almak istiyorum.';
  return `https://wa.me/${ORG.whatsappRaw}?text=${encodeURIComponent(text)}`;
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const ui = getUi(locale);
  const areasUrl = pageHref(locale, 'areas');
  const param = categoryParam[locale];

  // -my-1.5/py-1.5: görünen boşluk aynı kalırken dokunma alanı 21px'ten 33px'e çıkar.
  const columnLinkClass =
    'inline-block -my-1.5 py-1.5 text-[14px] leading-[21px] text-paper/76 transition-colors hover:text-sky-soft';

  // İletişim hapları (WhatsApp / telefon / e-posta)
  const pillClass =
    'rounded-full border border-paper/26 px-3.5 py-2 text-[14px] text-paper transition-colors hover:bg-paper/10 hover:text-white';

  return (
    <footer className="bg-navy text-paper">
      {/* Bülten */}
      <div className="shell grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-8 gap-x-[clamp(32px,5vw,72px)] pt-[clamp(40px,5vw,64px)]">
        <div>
          <h2 className="rise m-0 max-w-[24ch] font-display text-[clamp(22px,2.4vw,30px)] font-extrabold leading-[1.14] tracking-[-0.025em]">
            {t.ft.nlTitle}
          </h2>
          <p className="m-0 mt-3.5 max-w-[48ch] text-[15px] leading-6 text-paper/74">
            {t.ft.nlBody}
          </p>
        </div>
        <div className="self-center">
          <NewsletterForm
            locale={locale}
            strings={{
              placeholder: t.ft.nlPh,
              submit: t.ft.nlBtn,
              done: t.ft.nlOk,
              invalid: ui.newsletter.invalid,
              error: ui.newsletter.error,
              sending: ui.newsletter.sending,
            }}
          />
        </div>
      </div>

      {/* Bağlantı sütunları */}
      <div className="shell grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] items-start gap-8 gap-x-[clamp(24px,3vw,48px)] border-b border-paper/16 py-[clamp(40px,5vw,56px)]">
        <div>
          {/* Logo açık zemin istiyor: koyu alt bilgide beyaz kutu içinde */}
          <span className="inline-flex items-center rounded-xl bg-white px-3.5 py-2.5">
            <Image src={logo} alt={ORG.name} height={46} className="block h-[46px] w-auto" />
          </span>
          <p className="m-0 mt-4 max-w-[34ch] text-[14px] leading-[22px] text-paper/66">
            {t.ft.desc}
          </p>

          <span className="kicker-sm mb-2.5 mt-6 text-paper/50">{t.ft.contactTitle}</span>
          <div className="flex flex-wrap gap-2">
            <a
              href={whatsappHref(locale)}
              target="_blank"
              rel="noopener noreferrer"
              className={pillClass}
            >
              {t.ft.wa}
            </a>
            <a href={`tel:${ORG.phoneRaw}`} className={pillClass}>
              {locale === 'en' ? ORG.phoneIntl : ORG.phone}
            </a>
            <a href={`mailto:${ORG.email}`} className={pillClass}>
              {t.ft.mail}
            </a>
          </div>
        </div>

        <div>
          <span className="kicker-sm mb-3.5 text-paper/50">{t.ft.colAreas}</span>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {t.areas.map((area) => (
              <li key={area.title}>
                <Link href={`${areasUrl}?${param}=${area.cat}`} className={columnLinkClass}>
                  {area.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="kicker-sm mb-3.5 text-paper/50">{t.ft.colSupport}</span>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {supportDocKeys.map((key) => (
              <li key={key}>
                <Link href={docHref(locale, key)} className={columnLinkClass}>
                  {t.docs[key].t}
                </Link>
              </li>
            ))}
            <li>
              <Link href={pageHref(locale, 'contact')} className={columnLinkClass}>
                {t.nav.contact}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <span className="kicker-sm mb-3.5 text-paper/50">{t.ft.colGroup}</span>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {t.ft.groupItems.map((item) => (
              <li key={item.h}>
                <a
                  href={item.h}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={columnLinkClass}
                >
                  {item.l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Alt şerit */}
      <div className="shell flex flex-wrap items-center justify-between gap-x-7 gap-y-3 pb-10 pt-6">
        <span className="text-[13px] leading-5 text-paper/62">{t.ft.copy}</span>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {legalDocKeys.map((key) => (
            <Link
              key={key}
              href={docHref(locale, key)}
              className="inline-block -my-1.5 py-1.5 text-[13px] text-paper/76 transition-colors hover:text-sky-soft"
            >
              {t.docs[key].t}
            </Link>
          ))}
          <CookiePreferencesButton label={t.ft.prefs} />
        </div>
      </div>
    </footer>
  );
}
