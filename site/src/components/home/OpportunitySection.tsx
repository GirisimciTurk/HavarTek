import { Kicker, RuledList } from '@/components/ui';
import { getDictionary } from '@/content';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';

/** Ölçü display.sectionSm'den farklı olduğu için başlık sınıfı elle yazıldı. */
const title =
  'font-display text-[clamp(26px,3.2vw,44px)] font-extrabold leading-[1.14] tracking-[-0.03em]';

/**
 * Fırsat — tasarım "DroneTek v4.dc.html", 212–223. satırlar.
 * Solda başlık ve amber not, sağda üst çizgili madde listesi.
 */
export function OpportunitySection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="shell section-y grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-[clamp(28px,4vw,72px)]">
      <div>
        <Kicker>{t.oppK}</Kicker>
        <h2 className={cn(title, 'rise m-0 max-w-[26ch]')}>{t.oppTitle}</h2>
        <p className="m-0 mt-6 max-w-[44ch] text-[17px] leading-7 text-amber">{t.oppNote}</p>
      </div>

      <RuledList items={t.oppItems} />
    </section>
  );
}
