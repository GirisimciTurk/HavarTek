import { PhotoFrame } from '@/components/Photo';
import { Kicker, display } from '@/components/ui';
import { getDictionary } from '@/content';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';
import type { SlotId } from '@/lib/photos';

/** Kart sırası tasarımdaki `newsItems` ile aynı: v4-news-0..2 */
const slots: SlotId[] = ['news-0', 'news-1', 'news-2'];

/** Ölçü display.sectionSm'den farklı olduğu için başlık sınıfı elle yazıldı. */
const title =
  'font-display text-[clamp(28px,3.2vw,44px)] font-extrabold leading-[1.14] tracking-[-0.03em]';

/** İçerikteki "12.06.2026" biçimini <time dateTime> için ISO'ya çevirir. */
function isoDate(value: string): string {
  const [day, month, year] = value.split('.');
  return year && month && day ? `${year}-${month}-${day}` : value;
}

/**
 * Haberler — tasarım "DroneTek v4.dc.html", 242–260. satırlar.
 * Üç kart: 3/2 fotoğraf, tarih + etiket hapı, başlık ve özet.
 */
export function NewsSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="shell section-y">
      <Kicker>{t.newsK}</Kicker>
      <h2 className={cn(title, 'rise m-0')}>{t.newsTitle}</h2>

      <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-[clamp(20px,2.4vw,32px)]">
        {t.news.map((item, i) => (
          <article
            key={item.t}
            className="rise flex min-w-0 flex-col transition-transform duration-[350ms] ease-out-soft hover:-translate-y-[5px]"
          >
            <PhotoFrame
              ratio="3/2"
              slot={slots[i]}
              alt={item.t}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              frameClassName="flex-none"
            />

            <div className="mt-[18px] flex items-center gap-3">
              <time dateTime={isoDate(item.d)} className="tnum text-[13px] text-paper/60">
                {item.d}
              </time>
              <span className="rounded-full border border-amber/50 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-amber">
                {item.tag}
              </span>
            </div>

            <h3 className={cn(display.card, 'm-0 mt-3.5')}>{item.t}</h3>
            <p className="m-0 mt-2.5 text-[15px] leading-6 text-paper/72">{item.b}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
