import { Photo, Scrim, scrims } from '@/components/Photo';
import { RequestForm } from '@/components/contact/RequestForm';
import { Kicker, face } from '@/components/ui';
import { getDictionary } from '@/content';
import { getUi } from '@/content/ui';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';
import { photoAlt } from '@/lib/photo-alt';
import { ORG } from '@/lib/site';

/** Telefon / WhatsApp / e-posta hapları — tasarımdaki hover: zemin #E4EDF8. */
const pillClass =
  'rounded-full border border-line-chip bg-white px-4 py-2.5 text-[14px] text-ink hover:bg-tint hover:text-ink';

/**
 * "07 · Talep" bölümü — tasarım "HavarTek Aydınlık Tema.dc.html", 307–414.
 * satırlar. Ana sayfada `id="iletisim"` ile, iletişim sayfasında ise sayfanın
 * tamamı olarak (h1 + yüzen menü için üst boşluk) kullanılır.
 */
export function RequestSection({
  locale,
  headingLevel = 'h2',
  id,
  topPadding = false,
}: {
  locale: Locale;
  headingLevel?: 'h1' | 'h2';
  id?: string;
  /** Sayfanın ilk bölümüyse içerik yüzen menünün altından kurtulsun. */
  topPadding?: boolean;
}) {
  const t = getDictionary(locale);
  const ui = getUi(locale);
  const Heading = headingLevel;

  return (
    <section id={id} className="relative grid border-t border-line">
      <Photo slot="request-bg" alt={photoAlt(locale, 'request-bg')} sizes="100vw" />
      <Scrim gradient={scrims.request} />

      <div
        className={cn(
          'shell relative z-10 grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] items-start gap-[clamp(32px,4vw,64px)]',
          topPadding
            ? 'pt-[clamp(120px,14vw,180px)] pb-[clamp(56px,7vw,104px)]'
            : 'py-[clamp(56px,7vw,104px)]',
        )}
      >
        <div className="min-w-0">
          <Kicker>{t.reqK}</Kicker>
          <Heading className={cn(face.boldTight, 'rise m-0 max-w-[20ch] text-[clamp(30px,4.2vw,56px)]')}>
            {t.reqTitle}
          </Heading>
          <p className="m-0 mt-5 max-w-[52ch] text-[17px] leading-7 text-muted">{t.reqBody}</p>

          <div className="mt-[30px] flex flex-wrap gap-2">
            <a href={`tel:${ORG.phoneRaw}`} className={pillClass}>
              {locale === 'en' ? ORG.phoneIntl : ORG.phone}
            </a>
            <a
              href={`https://wa.me/${ORG.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className={pillClass}
            >
              WhatsApp · {ORG.whatsapp}
            </a>
            <a href={`mailto:${ORG.email}`} className={pillClass}>
              {ORG.email}
            </a>
          </div>

          <span className="kicker-sm mt-[34px] text-faint">{t.afterK}</span>
          <ol className="m-0 mt-3 list-none p-0">
            {t.afterItems.map((item, i) => (
              <li
                key={item}
                className={cn(
                  'flex gap-3.5 border-t border-line py-4',
                  i === t.afterItems.length - 1 && 'border-b',
                )}
              >
                <span className="flex-none font-display text-[14px] font-bold text-blue tnum">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[15px] leading-6 text-slate">{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="min-w-0 rounded-[20px] border border-line-soft bg-white p-[clamp(22px,2.6vw,34px)] shadow-panel">
          <RequestForm
            locale={locale}
            labels={t.form}
            roles={t.roles}
            interests={t.interests}
            ui={ui.form}
          />
        </div>
      </div>
    </section>
  );
}
