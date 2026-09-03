import { AreaCardGrid } from '@/components/home/AreaCardGrid';
import { Kicker } from '@/components/ui';
import { getDictionary } from '@/content';
import { getUi } from '@/content/ui';
import { categoryParam, pageHref, type Locale } from '@/lib/i18n';

/**
 * "Kullanım alanları" bölümü — tasarım: "DroneTek v4.dc.html" 107–135. satırlar.
 *
 * Başlık satırı sunucuda üretilir; kategori filtresi ve kart ızgarası
 * `AreaCardGrid` içinde (istemci) yaşar.
 */
export function AreasSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="shell section-y">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Kicker>{t.areasK}</Kicker>
          {/* display.section'dan tek farkı punto: tasarımda clamp(30px,3.8vw,52px) */}
          <h2 className="rise m-0 max-w-[24ch] font-display text-[clamp(30px,3.8vw,52px)] font-extrabold leading-[1.14] tracking-[-0.03em]">
            {t.areasTitle}
          </h2>
        </div>
        <p className="m-0 max-w-[44ch] text-[16px] leading-[26px] text-paper/72">{t.areasLead}</p>
      </div>

      <AreaCardGrid
        cats={t.cats}
        areas={t.areas}
        legend={getUi(locale).areasFilterLabel}
        areasHref={pageHref(locale, 'areas')}
        categoryParam={categoryParam[locale]}
      />
    </section>
  );
}
