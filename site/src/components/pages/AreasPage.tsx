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
] as const satisfies readonly SlotId[];

/**
 * Kullanım alanları sayfası. Tasarımda ("HavarTek Aydınlık Tema.dc.html") alt
 * sayfa yok; manşet "01 · Vaadimiz" şeridinin türevi (lacivert zemin, açık
 * yazı), altındaki liste ana sayfadaki kart ölçülerini kullanıyor.
 * Manşet sunucuda çizilir; filtreli liste URL sorgusunu okuduğu için istemci
 * bileşeni.
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
    // Oran sırayla değişiyor: çift indeks 4/3, tek indeks 3/2.
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
      {/* Manşet — üst menü akışta 0 yükseklikte olduğu için üst boşluk menüyü de karşılıyor. */}
      <section className="relative grid min-h-[min(60vh,560px)] bg-navy">
        <Photo slot="areas-hero" alt={photoAlt(locale, 'areas-hero')} sizes="100vw" priority />
        <Scrim gradient={scrims.pageHeader} />
        <div className="shell relative self-end pt-[clamp(120px,14vw,180px)] pb-[clamp(48px,6vw,88px)]">
          <span className="rise mb-[18px] block text-[12px] uppercase tracking-[0.16em] text-sky-soft">
            {t.apK}
          </span>
          <h1 className={cn(display.page, 'rise m-0 max-w-[22ch] text-white')}>{t.apTitle}</h1>
          <p className="m-0 mt-6 max-w-[58ch] text-[17px] leading-7 text-paper/80">{t.apLead}</p>
        </div>
      </section>

      <Suspense fallback={<AreaDetailListFallback {...listProps} />}>
        <AreaDetailList {...listProps} param={categoryParam[locale]} />
      </Suspense>
    </>
  );
}
