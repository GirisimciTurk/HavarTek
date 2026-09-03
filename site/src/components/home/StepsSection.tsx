import { Frame, Photo } from '@/components/Photo';
import { Kicker, face } from '@/components/ui';
import { getDictionary } from '@/content';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';
import type { SlotId } from '@/lib/photos';

/** Yuva sırası sözlükteki `steps` dizisiyle aynı. */
const stepSlots: SlotId[] = ['step-0', 'step-1', 'step-2', 'step-3'];

/** Görevden teslime dört adım — tasarım "DroneTek v4.dc.html", 168–183. satırlar. */
export function StepsSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="shell section-y">
      <Kicker>{t.stepsK}</Kicker>
      <h2 className={cn(face.bold, 'rise m-0 max-w-[24ch] text-[clamp(28px,3.2vw,44px)]')}>
        {t.stepsTitle}
      </h2>

      <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] items-start gap-[clamp(16px,2vw,28px)]">
        {t.steps.map((s, i) => (
          <article
            key={s.n}
            className="rise flex min-w-0 flex-col transition-transform duration-[350ms] ease-out-soft hover:-translate-y-[5px]"
          >
            <div className="relative grid">
              <Frame ratio="3/4">
                <Photo
                  slot={stepSlots[i]}
                  alt={s.t}
                  sizes="(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 25vw"
                />
              </Frame>
              <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-amber px-[11px] py-[5px] font-display text-[15px] font-extrabold tracking-[0.02em] text-ink tnum">
                {s.n}
              </span>
            </div>
            <h3 className={cn(face.semi, 'm-0 mt-[18px] text-[20px] leading-[25px]')}>{s.t}</h3>
            <p className="m-0 mt-2 text-[15px] leading-[23px] text-paper/72">{s.b}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
