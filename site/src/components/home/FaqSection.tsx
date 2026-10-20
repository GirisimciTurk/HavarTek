import { ButtonLink, face, Kicker } from '@/components/ui';
import { getDictionary } from '@/content';
import { cn } from '@/lib/cn';
import { pageHref, type Locale } from '@/lib/i18n';

/**
 * "Sık sorulan sorular" — tasarımda karşılığı yok; görünüm "Sahadan durumlar"
 * akordeonunun kartlarını izliyor. Yerel <details> kullanıldığı için JS
 * gerektirmez ve yanıtların tamamı HTML'de durur: arama motorları ve yapay
 * zekâ tarayıcıları kapalı yanıtları da okur. Aynı içerik FAQPage
 * yapılandırılmış verisi olarak da basılıyor (bkz. JsonLd.tsx → routeJsonLd).
 */
export function FaqSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="border-t border-line">
      <div className="shell section-y grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-start gap-[clamp(24px,3vw,56px)]">
        <div className="min-w-0 lg:sticky lg:top-[110px]">
          <Kicker>{t.faqK}</Kicker>
          <h2 className={cn(face.bold, 'rise m-0 max-w-[20ch] text-[clamp(26px,3vw,42px)]')}>
            {t.faqTitle}
          </h2>
          <p className="m-0 mt-4 max-w-[46ch] text-[15px] leading-[25px] text-muted">{t.faqLead}</p>
          <ButtonLink href={pageHref(locale, 'contact')} variant="primary" size="lg" className="mt-6">
            {t.cta}
          </ButtonLink>
        </div>

        <div className="flex min-w-0 flex-col gap-2.5">
          {t.faq.map((item, index) => (
            <details
              key={item.q}
              open={index === 0}
              className="group overflow-hidden rounded-[14px] border border-line-soft bg-white transition-[border-color,box-shadow] duration-200 open:border-blue open:shadow-open"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-[18px] px-[22px] py-5 [&::-webkit-details-marker]:hidden">
                <h3 className="m-0 font-display text-[18px] leading-[25px] font-semibold tracking-[-0.01em] text-ink">
                  {item.q}
                </h3>
                <span
                  aria-hidden
                  className="grid h-[26px] w-[26px] flex-none place-items-center rounded-full bg-tint text-[18px] leading-none text-blue transition-[rotate,background-color,color] duration-[250ms] ease-out-soft group-open:rotate-45 group-open:bg-blue group-open:text-white"
                >
                  +
                </span>
              </summary>
              <p className="m-0 px-[22px] pb-[22px] text-[15px] leading-6 text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
