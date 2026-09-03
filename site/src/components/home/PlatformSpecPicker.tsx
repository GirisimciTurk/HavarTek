'use client';

import Image from 'next/image';
import { useState, type ReactNode } from 'react';

import { CategoryChips } from '@/components/CategoryChips';
import { face } from '@/components/ui';
import { cn } from '@/lib/cn';
import { platformPhoto } from '@/lib/photos';

export type SpecPlatform = {
  id: string;
  /** Dile göre çözülmüş tür adı: "Çok rotorlu" / "Multirotor" */
  type: string;
  /** specLabels ile aynı sırada, dile göre çözülmüş değerler */
  values: readonly string[];
};

type Props = {
  platforms: readonly SpecPlatform[];
  specLabels: readonly { p: string; r: string }[];
  /** Platform kimliği → hazır not metni; sunucuda kuruluyor (t.note.a + id + t.note.b). */
  notes: Readonly<Record<string, string>>;
  /** Radyo grubunun ekran okuyucu başlığı */
  legend: string;
  /** Sol sütunun üst başlığı — sunucuda çizilip buraya veriliyor. */
  children: ReactNode;
};

/**
 * Ana sayfadaki teknik veri bloğunun seçime bağlı kısmı — tasarım
 * "DroneTek v4.dc.html", 139–164. satırlar.
 *
 * Fotoğraf ve not solda, değer satırları sağda; üçü de aynı seçime bağlı
 * olduğu için tek bileşen iki ızgara hücresini birden çiziyor (kapsayıcı
 * ızgarayı TechTeaserSection kuruyor).
 */
export function PlatformSpecPicker({ platforms, specLabels, notes, legend, children }: Props) {
  const [selected, setSelected] = useState(platforms[0].id);
  const active = platforms.find((p) => p.id === selected) ?? platforms[0];
  const label = `${active.id} · ${active.type}`;

  return (
    <>
      <div>
        {children}

        <CategoryChips
          name="home-platform"
          legend={legend}
          items={platforms.map((p) => ({ id: p.id, label: `${p.id} · ${p.type}` }))}
          value={active.id}
          onSelect={setSelected}
          className="mt-7"
        />

        {/* Seçime göre değiştiği için Photo/SlotId yerine platformPhoto tablosu. */}
        <div className="relative mt-7 aspect-[16/10] w-full overflow-hidden">
          <Image
            src={platformPhoto[active.id]}
            alt={label}
            fill
            sizes="(max-width: 800px) 100vw, (max-width: 1400px) 45vw, 560px"
            placeholder="blur"
            className="object-cover"
          />
        </div>

        <p className="m-0 mt-4 text-[13px] leading-[21px] text-paper/55">{notes[active.id]}</p>
      </div>

      <div className="flex flex-col">
        {specLabels.map((s, i) => (
          <div
            key={s.p}
            className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-3 border-t border-paper/14 py-[22px]"
          >
            <div>
              <div className="text-[16px] leading-[22px]">{s.p}</div>
              <div className="mt-1 text-[13px] leading-5 text-paper/55">{s.r}</div>
            </div>
            <div
              className={cn(
                face.stat,
                'text-[30px] tracking-[-0.02em] whitespace-nowrap text-amber',
              )}
            >
              {active.values[i]}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
