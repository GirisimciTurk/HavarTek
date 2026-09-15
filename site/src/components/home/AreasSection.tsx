import { AreaCardGrid } from '@/components/home/AreaCardGrid';
import { Kicker, face } from '@/components/ui';
import { getDictionary } from '@/content';
import { getUi } from '@/content/ui';
import { cn } from '@/lib/cn';
import { categoryParam, pageHref, type Locale } from '@/lib/i18n';

/**
 * "03 · Kullanım alanları" — tasarım "HavarTek Aydınlık Tema.dc.html",
 * 162–192. satırlar.
 *
 * Başlık satırı sunucuda üretilir; kategori filtresi ve kart ızgarası
 * `AreaCardGrid` içinde (istemci) yaşar.
 */
export function AreasSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section id="alanlar" className="shell section-y">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Kicker>{t.areasK}</Kicker>
          {/* display.section'dan tek farkı punto: tasarımda clamp(30px,3.8vw,52px) */}
          <h2 className={cn(face.bold, 'rise m-0 max-w-[24ch] text-[clamp(30px,3.8vw,52px)]')}>
            {t.areasTitle}
          </h2>
        </div>
        <p className="m-0 max-w-[44ch] text-[16px] leading-[26px] text-muted">{t.areasLead}</p>
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
