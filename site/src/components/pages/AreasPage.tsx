import { Suspense } from 'react';

import {
  AreaDetailList,
  AreaDetailListFallback,
  type AreaDetail,
  type AreaDetailProps,
} from '@/components/areas/AreaDetailList';
import { Photo, Scrim, scrims } from '@/components/Photo';
import { display } from '@/components/ui';
import { getDictionary } from '@/content';
import { getUi } from '@/content/ui';
import { cn } from '@/lib/cn';
import { categoryParam, type Locale } from '@/lib/i18n';
import { photoAlt } from '@/lib/photo-alt';
import type { SlotId } from '@/lib/photos';

/** `area-detail-N` yuvaları; N alanın site.json'daki (filtresiz) indeksi. */
const detailSlots = [
  'area-detail-0',
  'area-detail-1',
  'area-detail-2',
  'area-detail-3',
  'area-detail-4',
  'area-detail-5',
  'area-detail-6',
  'area-detail-7',
] as const satisfies readonly SlotId[];

/**
 * Kullanım alanları sayfası — tasarım "DroneTek v4.dc.html", 290–331. satırlar.
 * Manşet sunucuda çizilir; altındaki filtreli liste URL sorgusunu okuduğu için
 * istemci bileşeni.
 */
export function AreasPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const ui = getUi(locale);

  const areas: AreaDetail[] = t.areas.map((area, index) => ({
    cat: area.cat,
    catLabel: area.catLabel,
    title: area.title,
    body: area.body,
    items: area.items,
    slot: detailSlots[index],
    // Tasarımda oran sırayla değişiyor: çift indeks 4/3, tek indeks 3/2.
    ratio: index % 2 === 0 ? '4/3' : '3/2',
  }));

  const listProps: AreaDetailProps = {
    cats: t.cats,
    areas,
    legend: ui.areasFilterLabel,
    deliver: t.deliver,
  };

  return (
    <>
      <section className="relative grid min-h-[min(84vh,780px)] overflow-hidden">
        <Photo slot="areas-hero" alt={photoAlt(locale, 'areas-hero')} sizes="100vw" priority />
        <Scrim gradient={scrims.pageHeader} />
        <div className="shell relative self-end py-[clamp(48px,6vw,88px)]">
          <span className="kicker mb-5">{t.apK}</span>
          <h1 className={cn(display.page, 'rise m-0 max-w-[22ch]')}>{t.apTitle}</h1>
          <p className="m-0 mt-6 max-w-[58ch] text-[17px] leading-7 text-paper/76">{t.apLead}</p>
        </div>
      </section>

      <Suspense fallback={<AreaDetailListFallback {...listProps} />}>
        <AreaDetailList {...listProps} param={categoryParam[locale]} />
      </Suspense>
    </>
  );
}
