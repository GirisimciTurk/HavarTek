'use client';

import { useId, useState } from 'react';

import { cn } from '@/lib/cn';

export type StoryItem = {
  /** Kimin başına geldi: "Şehir hastanesi · kan bankası" */
  who: string;
  /** Başlık */
  t: string;
  /** Sorun */
  p: string;
  /** Çözüm (mavi sol çizgili alıntı) */
  s: string;
};

/**
 * "Sahadan durumlar" akordeonu — tasarım "HavarTek Aydınlık Tema.dc.html",
 * 249–264. satırlar; stiller script'teki cardStyle / iconStyle / bodyStyle.
 *
 * İlk öğe açık başlar; açık olana basınca kapanır (tasarımdaki `openStory`
 * mantığı). Gövde `grid-template-rows` geçişiyle açılıp kapanıyor; içerik DOM'da
 * kaldığı için arama ve ekran okuyucu erişimi bozulmuyor.
 */
export function StoriesAccordion({ stories }: { stories: readonly StoryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const baseId = useId();

  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      {stories.map((story, i) => {
        const open = openIndex === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;

        return (
          <div
            key={story.t}
            className={cn(
              'overflow-hidden rounded-[14px] border bg-white transition-[border-color,box-shadow] duration-200',
              open ? 'border-blue shadow-open' : 'border-line-soft',
            )}
          >
            <button
              type="button"
              id={buttonId}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenIndex(open ? -1 : i)}
              className="flex w-full cursor-pointer items-start justify-between gap-[18px] border-0 bg-transparent px-[22px] py-5 text-left"
            >
              <span className="min-w-0">
                <span className="mb-2 block text-[11px] uppercase tracking-[0.12em] text-blue">
                  {story.who}
                </span>
                <span className="block font-display text-[18px] leading-[25px] font-semibold tracking-[-0.01em] text-ink">
                  {story.t}
                </span>
              </span>
              <span
                aria-hidden
                className={cn(
                  'grid h-[26px] w-[26px] flex-none place-items-center rounded-full text-[18px] leading-none transition-[transform,background-color,color] duration-200 ease-out-soft',
                  open ? 'rotate-45 bg-blue text-white' : 'bg-tint text-blue',
                )}
              >
                +
              </span>
            </button>

            {/* Kapalıyken içerik DOM'da kalıyor (geçiş için) ama `inert` ile
                odak ve ekran okuyucu erişiminin dışında tutuluyor. */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!open}
              className={cn(
                'grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out-soft',
                open ? 'grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="px-[22px] pb-[22px]">
                  <p className="m-0 text-[15px] leading-6 text-muted">{story.p}</p>
                  <p className="m-0 mt-3.5 border-l-2 border-blue pl-3.5 text-[15px] leading-6 text-ink">
                    {story.s}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
