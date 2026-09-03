import { PhotoFrame } from '@/components/Photo';
import { Kicker, display } from '@/components/ui';
import { getDictionary } from '@/content';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';
import type { SlotId } from '@/lib/photos';

/** Kart sırası tasarımdaki `missionCards` ile aynı: v4-mission-0..2 */
const slots: SlotId[] = ['mission-0', 'mission-1', 'mission-2'];

/**
 * "Bu platform ne yapar" — tasarım "DroneTek v4.dc.html", 93–105. satırlar.
 * Alt boşluk yok: bir sonraki bölüm kendi üst boşluğunu getiriyor.
 */
export function MissionSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="shell pt-[clamp(64px,7vw,104px)] pb-0">
      <Kicker>{t.missionK}</Kicker>
      <h2 className={cn(display.section, 'rise m-0 max-w-[22ch]')}>{t.missionTitle}</h2>

      <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-[clamp(16px,2vw,28px)]">
        {t.missionItems.map((item, i) => (
          <div
            key={item.t}
            className="rise flex min-w-0 flex-col transition-transform duration-[350ms] ease-out-soft hover:-translate-y-[5px]"
          >
            <PhotoFrame
              ratio="4/3"
              slot={slots[i]}
              alt={item.t}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              frameClassName="flex-none"
            />
            <h3 className={cn(display.card, 'm-0 mt-[18px]')}>{item.t}</h3>
            <p className="m-0 mt-2.5 text-[15px] leading-6 text-paper/74">{item.b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
