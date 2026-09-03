import { Photo, Scrim, scrims } from '@/components/Photo';
import { display } from '@/components/ui';
import { getDictionary } from '@/content';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';
import { photoAlt } from '@/lib/photo-alt';

/** Sayısal görünüm şeridi — tasarım "DroneTek v4.dc.html", 77–91. satırlar. */
export function StatsSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="relative grid min-h-[min(58vh,520px)] border-b border-paper/12">
      <Photo slot="stats-bg" alt={photoAlt(locale, 'stats-bg')} sizes="100vw" />
      <Scrim gradient={scrims.stats} />

      <div className="shell pointer-events-none relative self-center py-[clamp(40px,5vw,72px)]">
        <span className="kicker mb-8">{t.statsK}</span>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-8">
          {t.stats.map((s) => (
            <div key={s.l}>
              <div className={cn(display.stat, 'rise text-[clamp(40px,5.2vw,68px)]')}>{s.v}</div>
              <div className="mt-3.5 text-[14px] leading-5 text-paper/74">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
