'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { CategoryChips, type Category } from '@/components/CategoryChips';
import { PhotoFrame } from '@/components/Photo';
import { face } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { SlotId } from '@/lib/photos';

export type AreaDetail = {
  cat: string;
  catLabel: string;
  title: string;
  body: string;
  items: readonly string[];
  /** Yuva ve en-boy oranı, alanın FİLTRESİZ listedeki indeksinden türetilir. */
  slot: SlotId;
  ratio: string;
};

export type AreaDetailProps = {
  cats: readonly Category[];
  areas: readonly AreaDetail[];
  legend: string;
  deliver: string;
};

function AreaDetailView({
  cats,
  areas,
  legend,
  deliver,
  cat,
  onSelect,
}: AreaDetailProps & { cat: string; onSelect: (id: string) => void }) {
  const visible = areas.filter((area) => cat === 'all' || area.cat === cat);

  return (
    <>
      <section className="shell pt-9">
        <CategoryChips
          name="area-cat"
          legend={legend}
          items={cats}
          value={cat}
          onSelect={onSelect}
        />
      </section>

      <section className="shell flex flex-col gap-[clamp(48px,6vw,88px)] pt-[clamp(40px,5vw,64px)] pb-[clamp(72px,8vw,112px)]">
        {visible.map((area) => (
          <article
            key={area.slot}
            className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-[clamp(24px,3vw,56px)]"
          >
            <PhotoFrame
              ratio={area.ratio}
              slot={area.slot}
              alt={area.title}
              sizes="(max-width: 900px) 100vw, 50vw"
              frameClassName="rounded-2xl"
            />
            <div>
              <span className="kicker-sm mb-3.5 text-blue">{area.catLabel}</span>
              {/* Bu başlık display.sectionSm'den bir tık küçük (tavan 38px); punto yerinde verildi. */}
              <h2 className={cn(face.bold, 'rise m-0 text-[clamp(26px,2.8vw,38px)]')}>
                {area.title}
              </h2>
              <p className="m-0 mt-4 max-w-[48ch] text-[16px] leading-[26px] text-muted">
                {area.body}
              </p>
              <span className="kicker-sm mt-7 mb-2.5 text-faint">{deliver}</span>
              <ul className="m-0 flex list-none flex-col p-0">
                {area.items.map((item) => (
                  <li
                    key={item}
                    className="border-t border-line py-[11px] text-[15px] leading-[23px] text-slate"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

/**
 * Kategori filtresi. Seçim adres çubuğunda tutulur: alt bilgideki
 * `?kategori=lojistik` bağlantıları doğrudan ilgili filtreyi açar ve seçili
 * görünüm paylaşılabilir olur.
 */
export function AreaDetailList({
  param,
  cats,
  areas,
  legend,
  deliver,
}: AreaDetailProps & { param: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Bilinmeyen veya boş değer "Tümü" demek.
  const raw = searchParams.get(param);
  const cat = raw && cats.some((item) => item.id === raw) ? raw : 'all';

  const select = (id: string) => {
    // replace + scroll:false → geri tuşu filtre geçmişiyle dolmaz, sayfa zıplamaz.
    router.replace(id === 'all' ? pathname : `?${param}=${id}`, { scroll: false });
  };

  return (
    <AreaDetailView
      cats={cats}
      areas={areas}
      legend={legend}
      deliver={deliver}
      cat={cat}
      onSelect={select}
    />
  );
}

/**
 * `useSearchParams` bir <Suspense> sınırı zorunlu kıldığı için gereken yedek:
 * sunucuda çizilen filtresiz ("Tümü") görünüm.
 */
export function AreaDetailListFallback(props: AreaDetailProps) {
  return <AreaDetailView {...props} cat="all" onSelect={() => undefined} />;
}
