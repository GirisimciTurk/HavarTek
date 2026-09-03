import { getDictionary } from '@/content';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';

/** Ölçü display.sectionSm'den farklı olduğu için başlık sınıfı elle yazıldı. */
const title =
  'font-display text-[clamp(28px,3.2vw,44px)] font-extrabold leading-[1.14] tracking-[-0.03em]';

/**
 * Mevzuat — tasarım "DroneTek v4.dc.html", 225–240. satırlar.
 * Sayfadaki tek amber zeminli bölüm: yazı koyu, ayraçlar da koyu.
 * (RuledList paper renkli ayraç kullandığı için liste burada elle yazılıyor.)
 */
export function RegulationSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="bg-amber text-ink">
      <div className="shell grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-x-[clamp(32px,5vw,80px)] gap-y-8 py-[clamp(56px,6vw,88px)]">
        <div>
          <span className="mb-[18px] block text-[12px] uppercase tracking-[0.16em] text-ink/70">
            {t.regK}
          </span>
          <h2 className={cn(title, 'rise m-0')}>{t.regTitle}</h2>
          <p className="m-0 mt-5 max-w-[46ch] text-[16px] leading-[26px] text-ink/82">
            {t.regBody}
          </p>
        </div>

        <ul className="m-0 flex list-none flex-col self-center p-0">
          {t.regItems.map((item) => (
            <li key={item} className="border-t border-ink/24 py-4 text-[16px] leading-6">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
