import { Photo, PhotoFrame, Scrim, scrims } from '@/components/Photo';
import { ButtonLink, display, face, Kicker } from '@/components/ui';
import { getDictionary, localizedValue, platformData } from '@/content';
import { cn } from '@/lib/cn';
import { pageHref, type Locale } from '@/lib/i18n';
import { photoAlt } from '@/lib/photo-alt';
import type { SlotId } from '@/lib/photos';

/** Fotoğraf yuvaları, kart sırasıyla eşleşir. */
const platformSlots = ['plat-0', 'plat-1', 'plat-2'] as const satisfies readonly SlotId[];
const payloadSlots = [
  'payload-0',
  'payload-1',
  'payload-2',
  'payload-3',
] as const satisfies readonly SlotId[];

/** Kartların ortak yükselme hareketi (tasarımdaki style-hover karşılığı). */
const cardLift =
  'flex min-w-0 flex-col transition-transform duration-[350ms] ease-out-soft hover:translate-y-[-5px]';

const thClass =
  'border-b border-line py-3.5 pr-5 text-[12px] font-medium uppercase tracking-[0.12em] text-faint';
const rowHeadClass =
  'border-b border-line py-[18px] pr-5 text-left text-[16px] font-normal leading-6 text-muted';
const cellClass =
  'border-b border-line py-[18px] pr-5 font-display text-[22px] font-extrabold leading-6 tracking-[-0.02em] whitespace-nowrap text-ink tnum';

/**
 * Teknoloji sayfası. Tasarımda ("HavarTek Aydınlık Tema.dc.html") alt sayfa
 * yok; manşet "01 · Vaadimiz" şeridinin türevi, kartlar ve tablo açık temanın
 * token'larıyla çizildi. Etkileşim yok; tamamı sunucuda çizilir.
 */
export function TechPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  /** Tablo başlığı ve kart alt metni: "VK-4 · Çok rotorlu" */
  const platformLabel = (index: number): string => {
    const p = platformData[index];
    return `${p.id} · ${p.type[locale]}`;
  };

  return (
    <>
      {/* Manşet — üst menü akışta 0 yükseklikte olduğu için üst boşluk menüyü de karşılıyor. */}
      <section className="relative grid min-h-[min(60vh,560px)] bg-navy">
        <Photo slot="tech-hero" alt={photoAlt(locale, 'tech-hero')} sizes="100vw" priority />
        <Scrim gradient={scrims.pageHeader} />
        <div className="shell relative self-end pt-[clamp(120px,14vw,180px)] pb-[clamp(48px,6vw,88px)]">
          <span className="rise mb-[18px] block text-[12px] uppercase tracking-[0.16em] text-sky-soft">
            {t.tpK}
          </span>
          <h1 className={cn(display.page, 'rise m-0 max-w-[20ch] text-white')}>{t.tpTitle}</h1>
          <p className="m-0 mt-6 max-w-[56ch] text-[17px] leading-7 text-paper/80">{t.tpLead}</p>
        </div>
      </section>

      {/* Uçuş platformları */}
      <section className="shell py-[clamp(56px,6vw,88px)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-[clamp(20px,2.4vw,32px)]">
          {platformData.map((platform, index) => (
            <article key={platform.id} className={cn('rise', cardLift)}>
              <PhotoFrame
                ratio="3/4"
                slot={platformSlots[index]}
                alt={platformLabel(index)}
                sizes="(max-width: 660px) 100vw, (max-width: 1080px) 50vw, 420px"
                frameClassName="flex-none rounded-2xl"
              />
              <h3 className="m-0 mt-[18px] font-display text-[24px] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink">
                {platform.id}
              </h3>
              <p className="m-0 mt-1.5 text-[14px] leading-[22px] text-muted">
                {platform.type[locale]}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Karşılaştırma tablosu — beyaz şerit, üst ve altta ayraç */}
      <section className="border-y border-line bg-white">
        <div className="shell py-[clamp(56px,6vw,88px)]">
          {/* Bu başlık display.sectionSm'den 2px küçük tavanla duruyor; punto yerinde verildi. */}
          <h2 className={cn(face.bold, 'rise m-0 mb-8 text-[clamp(26px,3vw,40px)] text-ink')}>
            {t.matrixTitle}
          </h2>
          {/* Tablo dar ekranda kendi içinde kayar; sağ kenardaki soluklaşma
              kaydırılabilir olduğunu belli eder, tabIndex klavyeyle erişimi açar. */}
          <div
            role="region"
            aria-label={t.matrixTitle}
            tabIndex={0}
            className="relative overflow-x-auto [mask-image:linear-gradient(to_right,#000_0,#000_calc(100%-40px),transparent_100%)] md:[mask-image:none]"
          >
            <table className="w-full min-w-[620px] border-collapse text-left">
              <caption className="sr-only">{t.matrixTitle}</caption>
              <thead>
                <tr>
                  <th scope="col" className={thClass}>
                    {t.cols.prop}
                  </th>
                  {platformData.map((platform, index) => (
                    <th key={platform.id} scope="col" className={thClass}>
                      {platformLabel(index)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.specLabels.map((spec, row) => (
                  <tr key={spec.p}>
                    <th scope="row" className={rowHeadClass}>
                      {spec.p}
                    </th>
                    {platformData.map((platform) => (
                      <td key={platform.id} className={cellClass}>
                        {localizedValue(platform.values[row], locale)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sensör yükleri */}
      <section className="shell py-[clamp(56px,6vw,96px)]">
        <Kicker>{t.payloadK}</Kicker>
        <h2 className={cn(display.sectionSm, 'rise m-0 text-ink')}>{t.payloadTitle}</h2>
        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] items-start gap-[clamp(20px,2.4vw,32px)]">
          {t.payloads.map((payload, index) => (
            <article key={payload.t} className={cn('rise', cardLift)}>
              <PhotoFrame
                ratio="1/1"
                slot={payloadSlots[index]}
                alt={payload.t}
                sizes="(max-width: 620px) 100vw, (max-width: 1080px) 50vw, 300px"
                frameClassName="flex-none rounded-2xl"
              />
              <h3 className={cn(display.cardSm, 'm-0 mt-4 text-ink')}>{payload.t}</h3>
              <p className="m-0 mt-2 text-[15px] leading-[23px] text-muted">{payload.b}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Yazılım / veri hattı */}
      <section className="shell grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-[clamp(32px,4vw,72px)] pb-[clamp(72px,8vw,112px)]">
        <div>
          <Kicker>{t.swK}</Kicker>
          <h2 className={cn(display.sectionSm, 'rise m-0 text-ink')}>{t.swTitle}</h2>
          <div className="mt-7 flex flex-col">
            {t.sw.map((step) => (
              <div key={step.t} className="border-t border-line py-5">
                <h3 className={cn(display.cardSm, 'm-0 text-ink')}>{step.t}</h3>
                <p className="m-0 mt-2 text-[15px] leading-[23px] text-muted">{step.b}</p>
              </div>
            ))}
          </div>
          {/* 3B model menüde yok; teknoloji sayfasındaki bu düğmeden erişilir. */}
          <ButtonLink href={pageHref(locale, 'model3d')} variant="ghost" size="md" className="mt-8">
            {t.nav3d}
          </ButtonLink>
        </div>
        {/* Kaynak fotoğraf 250×200; büyütmemek için sizes dar tutuldu. */}
        <PhotoFrame
          ratio="4/3"
          slot="software"
          alt={photoAlt(locale, 'software')}
          sizes="(max-width: 900px) 100vw, 460px"
          frameClassName="rounded-2xl"
        />
      </section>
    </>
  );
}
