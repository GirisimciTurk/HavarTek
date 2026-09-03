import { Photo, Scrim, scrims } from '@/components/Photo';
import { getDictionary } from '@/content';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';
import { photoAlt } from '@/lib/photo-alt';

/**
 * Tasarımdaki ölçü display.section token'ından büyük (clamp(28px,4.2vw,60px)),
 * bu yüzden başlık sınıfı elle yazıldı — iki farklı font-size sınıfı çakışmasın.
 */
const title =
  'font-display text-[clamp(28px,4.2vw,60px)] font-extrabold leading-[1.14] tracking-[-0.03em]';

/**
 * Afet vurgusu — tasarım "DroneTek v4.dc.html", 203–210. satırlar.
 * Fotoğraf tam genişlik, metin alta hizalı; ilk satır soluk, ikincisi tam beyaz.
 */
export function DisasterSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="relative grid min-h-[min(86vh,820px)]">
      <Photo slot="disaster" alt={photoAlt(locale, 'disaster')} sizes="100vw" />
      <Scrim gradient={scrims.disaster} />

      <div className="shell relative self-end py-[clamp(56px,7vw,104px)]">
        <h2 className={cn(title, 'rise m-0 max-w-[26ch] text-paper/72')}>{t.disasterA}</h2>
        <h2 className={cn(title, 'rise m-0 mt-4 max-w-[26ch]')}>{t.disasterB}</h2>
      </div>
    </section>
  );
}
