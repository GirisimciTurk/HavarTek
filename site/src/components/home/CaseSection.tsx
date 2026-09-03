import { Photo, Scrim, scrims } from '@/components/Photo';
import { display } from '@/components/ui';
import { getDictionary } from '@/content';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';
import { photoAlt } from '@/lib/photo-alt';

/**
 * Vaka çalışması — tasarım "DroneTek v4.dc.html", 185–201. satırlar.
 * Tam genişlik fotoğraf, yatay gradyan, içerik dikey ortalı.
 */
export function CaseSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="relative grid min-h-[min(92vh,900px)]">
      <Photo slot="case" alt={photoAlt(locale, 'case')} sizes="100vw" />
      <Scrim gradient={scrims.sideways} />

      <div className="shell relative self-center py-[clamp(56px,7vw,96px)]">
        {/* Bu bölümdeki etiketin tasarımda rise animasyonu yok */}
        <span className="kicker mb-6">{t.caseK}</span>

        <blockquote className="m-0 max-w-[34ch] font-display text-[clamp(24px,3.1vw,40px)] font-semibold leading-[1.22] tracking-[-0.025em]">
          {t.caseQuote}
        </blockquote>
        <p className="m-0 mt-7 text-[15px] leading-6 text-paper/66">{t.caseAuthor}</p>

        <div className="mt-11 flex flex-wrap gap-12">
          {t.caseMetrics.map((metric) => (
            <div key={metric.l}>
              <div className={cn(display.stat, 'text-[38px]')}>{metric.v}</div>
              <div className="mt-2.5 text-[13px] leading-5 text-paper/62">{metric.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
