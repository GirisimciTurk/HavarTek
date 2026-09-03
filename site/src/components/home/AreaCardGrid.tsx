'use client';

import Link from 'next/link';
import { useState } from 'react';

import { CategoryChips, type Category } from '@/components/CategoryChips';
import { Photo, Scrim, scrims } from '@/components/Photo';
import type { Area } from '@/content';
import type { SlotId } from '@/lib/photos';

type Props = {
  cats: Category[];
  areas: Area[];
  /** Radyo grubunun ekran okuyucu başlığı */
  legend: string;
  /** Kullanım alanları sayfasının adresi (dile göre değişir) */
  areasHref: string;
  /** Kategori sorgu parametresi: "kategori" / "category" */
  categoryParam: string;
};

/**
 * Kategori filtresi + kullanım alanı kartları — tasarım 120–134. satırlar.
 *
 * Metinler prop olarak geliyor; `@/content` istemciye inmesin diye burada
 * yalnızca tip olarak import ediliyor.
 */
export function AreaCardGrid({ cats, areas, legend, areasHref, categoryParam }: Props) {
  const [cat, setCat] = useState('all');

  // Fotoğraf yuvası alanın ORİJİNAL sırasına bağlı; filtrelenmiş dizinin kayan
  // indeksi kullanılırsa kartlar yanlış görselle eşleşir.
  const visible = areas
    .map((area, index) => ({ area, index }))
    .filter(({ area }) => cat === 'all' || area.cat === cat);

  return (
    <>
      <CategoryChips
        name="home-cat"
        legend={legend}
        items={cats}
        value={cat}
        onSelect={setCat}
        className="mt-10"
      />

      {/* minmax'in alt sınırı min() ile sarıldı: 460px dar ekranda yatay taşma yapıyordu */}
      <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(min(460px,100%),1fr))] gap-0.5">
        {visible.map(({ area, index }) => (
          <article
            key={index}
            className="fade-in relative grid min-h-[min(72vh,620px)] overflow-hidden bg-surface"
          >
            <Photo
              slot={`area-${index}` as SlotId}
              alt={area.title}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <Scrim gradient={scrims.card} />
            {/* Izgara öğesinde z-index `position` olmadan da çalışır. Kap
                konumlandırılmadığı için başlıktaki bağlantının `after`ı
                <article>'a göre yayılıp tüm kartı tıklanabilir yapıyor. */}
            <div className="z-10 self-end px-8 pt-8 pb-9">
              <span className="kicker-sm mb-3 text-amber">{area.catLabel}</span>
              <h3 className="m-0 font-display text-[26px] leading-[1.2] font-semibold tracking-[-0.02em]">
                <Link
                  href={`${areasHref}?${categoryParam}=${area.cat}`}
                  className="text-paper transition-colors after:absolute after:inset-0 after:content-[''] hover:text-amber-lift"
                >
                  {area.title}
                </Link>
              </h3>
              <p className="m-0 mt-3 max-w-[46ch] text-[15px] leading-6 text-paper/82">
                {area.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
