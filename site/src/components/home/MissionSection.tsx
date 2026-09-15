import { PhotoFrame } from '@/components/Photo';
import { Kicker, cardClass, display } from '@/components/ui';
import { getDictionary } from '@/content';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';
import type { SlotId } from '@/lib/photos';

/** Kart sırası sözlükteki `missionItems` ile aynı: mission-0..2 */
const slots: SlotId[] = ['mission-0', 'mission-1', 'mission-2'];

/**
 * "02 · Platform — Bu platform ne yapar" — tasarım "HavarTek Aydınlık
 * Tema.dc.html", 130–160. satırlar. Üç beyaz kart: 4/3 fotoğraf, başlık,
 * açıklama ve mavi alt not. Alt boşluk yok: sonraki bölüm kendi üst
 * boşluğunu getiriyor.
 */
export function MissionSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="shell pt-[clamp(64px,7vw,104px)]">
      <Kicker>{t.missionK}</Kicker>
      <h2 className={cn(display.section, 'rise m-0 max-w-[22ch]')}>{t.missionTitle}</h2>
      <p className="m-0 mt-5 max-w-[64ch] text-[16px] leading-[27px] text-muted">
        {t.missionLead}
      </p>

      <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-[clamp(16px,2vw,28px)]">
        {t.missionItems.map((item, i) => (
          <div key={item.t} className={cn(cardClass, 'flex min-w-0 flex-col overflow-hidden')}>
            <PhotoFrame
              ratio="4/3"
              slot={slots[i]}
              alt={item.t}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              frameClassName="flex-none"
            />
            <div className="px-[22px] pt-5 pb-6">
              <h3 className={cn(display.card, 'm-0')}>{item.t}</h3>
              <p className="m-0 mt-2.5 text-[15px] leading-6 text-muted">{item.b}</p>
              <p className="m-0 mt-3.5 border-t border-tint pt-3.5 text-[14px] leading-[22px] text-blue">
                {item.n}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
