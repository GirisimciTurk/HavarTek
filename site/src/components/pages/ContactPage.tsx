import { Photo, PhotoFrame, Scrim, scrims } from '@/components/Photo';
import { RequestForm } from '@/components/contact/RequestForm';
import { Kicker } from '@/components/ui';
import { getDictionary } from '@/content';
import { getUi } from '@/content/ui';
import type { Locale } from '@/lib/i18n';
import { photoAlt } from '@/lib/photo-alt';

/**
 * Ofis satırlarından ikisi iletişim kanalı: telefon ve e-posta tıklanabilir
 * olmalı. Sıraya değil içeriğe bakılıyor, metin değişse de çalışsın.
 */
function officeHref(value: string): string | null {
  if (value.includes('@')) return `mailto:${value}`;
  if (value.startsWith('+')) return `tel:${value.replace(/[^\d+]/g, '')}`;
  return null;
}

/** İletişim sayfası — tasarım "DroneTek v4.dc.html", 417–503. satırlar. */
export function ContactPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const ui = getUi(locale);

  return (
    <>
      <section className="relative grid min-h-[min(56vh,480px)]">
        <Photo slot="contact-hero" alt={photoAlt(locale, 'contact-hero')} sizes="100vw" priority />
        <Scrim gradient={scrims.contactHeader} />
      </section>

      <section className="shell grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-[clamp(32px,4vw,72px)] pt-[clamp(48px,5vw,80px)] pb-[clamp(56px,6vw,88px)]">
        <div>
          <Kicker>{t.cpK}</Kicker>
          <h1 className="rise m-0 font-display text-[clamp(34px,4.6vw,64px)] leading-none font-extrabold tracking-[-0.035em]">
            {t.ctaTitle}
          </h1>
          <p className="m-0 mt-6 max-w-[44ch] text-[17px] leading-7 text-paper/76">{t.ctaBody}</p>

          <div className="mt-9">
            <span className="kicker-sm mb-2.5 text-paper/55">{t.officeTitle}</span>
            <ul className="m-0 flex list-none flex-col p-0">
              {t.office.map((line) => {
                const link = officeHref(line);
                return (
                  <li
                    key={line}
                    className="border-t border-paper/14 py-3 text-[16px] leading-6"
                  >
                    {link ? (
                      <a href={link} className="text-paper transition-colors hover:text-amber">
                        {line}
                      </a>
                    ) : (
                      line
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-9">
            <PhotoFrame
              ratio="16/9"
              slot="contact-office"
              alt={photoAlt(locale, 'contact-office')}
              sizes="(max-width: 900px) 100vw, 560px"
            />
          </div>
        </div>

        <div className="bg-surface p-[clamp(24px,3vw,36px)]">
          <RequestForm
            locale={locale}
            labels={t.form}
            roles={t.roles}
            sectors={t.sectors}
            ui={ui.form}
          />
        </div>
      </section>
    </>
  );
}
