import { PhotoFrame } from '@/components/Photo';
import { Kicker, RuledList } from '@/components/ui';
import { getDictionary } from '@/content';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';
import { photoAlt } from '@/lib/photo-alt';

/** Ölçü display.sectionSm'den farklı olduğu için başlık sınıfı elle yazıldı. */
const title =
  'font-display text-[clamp(26px,3.2vw,44px)] font-extrabold leading-[1.14] tracking-[-0.03em]';

/**
 * Katılım — tasarım "DroneTek v4.dc.html", 262–276. satırlar.
 * Üst boşluk bir öncekinden küçük, alt boşluk CTA'dan önce tam ölçü.
 */
export function JoinSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="shell grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-[clamp(28px,4vw,72px)] pt-[clamp(48px,6vw,88px)] pb-[clamp(64px,7vw,104px)]">
      <div>
        <Kicker>{t.joinK}</Kicker>
        <h2 className={cn(title, 'rise m-0 max-w-[24ch]')}>{t.joinTitle}</h2>
        <p className="m-0 mt-[22px] max-w-[44ch] text-[16px] leading-[26px] text-paper/76">
          {t.joinNote}
        </p>

        <PhotoFrame
          ratio="16/9"
          slot="join"
          alt={photoAlt(locale, 'join')}
          sizes="(max-width: 780px) 100vw, 50vw"
          frameClassName="mt-8"
        />
      </div>

      <RuledList items={t.joinItems} />
    </section>
  );
}
