'use client';

import { chipClass } from '@/components/ui';

export type Category = { id: string; label: string };

/**
 * Kategori / platform seçim etiketleri. Tasarımda gizli radio düğmeleri
 * kullanılıyordu; burada da klavyeyle gezilebilmesi için gerçek radio grubu
 * korunuyor, görsel olarak hap biçimli etiketler gösteriliyor.
 */
export function CategoryChips({
  name,
  legend,
  items,
  value,
  onSelect,
  className,
}: {
  name: string;
  legend: string;
  items: readonly Category[];
  value: string;
  onSelect: (id: string) => void;
  className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className="sr-only">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = item.id === value;
          return (
            <label key={item.id} className={chipClass(active)}>
              <input
                type="radio"
                name={name}
                value={item.id}
                checked={active}
                onChange={() => onSelect(item.id)}
                className="sr-only"
              />
              {item.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
