import { Photo, Scrim, scrims } from '@/components/Photo';
import { face } from '@/components/ui';
import { getDictionary } from '@/content';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';
import { photoAlt } from '@/lib/photo-alt';

/**
 * "01 · Vaadimiz" — tasarım "HavarTek Aydınlık Tema.dc.html", 103–128. satırlar.
 *
 * Lacivert şerit: fotoğraf %30 opaklıkla altta, üstünde lacivert gradyan.
 * Dört vaat üst çizgili sütunlar hâlinde. Koyu zeminde olduğu için `Kicker`
 * yerine sky-soft renkli etiket elle yazıldı (kicker rengi sabit mavi).
 */
export function PromiseSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="relative grid min-h-[min(66vh,600px)] bg-navy">
      <Photo
        slot="promise-bg"
        alt={photoAlt(locale, 'promise-bg')}
        sizes="100vw"
        className="opacity-30"
      />
      <Scrim gradient={scrims.promise} />

      <div className="shell relative self-center py-[clamp(40px,5vw,72px)]">
        <span className="rise mb-[18px] block text-[12px] uppercase tracking-[0.16em] text-sky-soft">
          {t.promiseK}
        </span>
        <h2 className={cn(face.bold, 'rise m-0 max-w-[26ch] text-[clamp(26px,3.2vw,44px)] text-white')}>
          {t.promiseTitle}
        </h2>

        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[clamp(20px,2.5vw,32px)]">
          {t.promiseItems.map((item) => (
            <div key={item.t} className="border-t border-paper/28 pt-[18px]">
              {/* face.semi'nin harf aralığı (-0.015em) tasarımdakinden farklı;
                  çakışan iki tracking yazmamak için yüz elle açıldı. */}
              <h3 className="m-0 font-display text-[19px] leading-[26px] font-semibold tracking-[-0.008em] text-white">
                {item.t}
              </h3>
              <p className="m-0 mt-2.5 text-[15px] leading-6 text-paper/78">{item.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
