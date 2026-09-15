import { Photo, Scrim, scrims } from '@/components/Photo';
import { Kicker, face } from '@/components/ui';
import { getDictionary } from '@/content';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';
import { photoAlt } from '@/lib/photo-alt';

/**
 * "05 · Neden hava yolu" — tasarım "HavarTek Aydınlık Tema.dc.html", 267–281.
 * satırlar. Fotoğraf sağda görünür kalır; soldan gelen açık zemin perdesinin
 * üstünde beyaz kutulu madde listesi.
 */
export function WhyAirSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="relative grid min-h-[min(70vh,640px)] border-t border-line">
      <Photo slot="why-air" alt={photoAlt(locale, 'why-air')} sizes="100vw" />
      <Scrim gradient={scrims.sideways} />

      <div className="shell relative self-center py-[clamp(48px,6vw,88px)]">
        <div className="max-w-[560px]">
          <Kicker>{t.whyK}</Kicker>
          <h2 className={cn(face.bold, 'rise m-0 text-[clamp(26px,3vw,42px)]')}>{t.whyTitle}</h2>

          <ul className="m-0 mt-8 flex list-none flex-col gap-3.5 rounded-[18px] border border-line-soft bg-white p-[26px]">
            {t.whyItems.map((item) => (
              <li key={item} className="text-[15px] leading-6 text-slate">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
