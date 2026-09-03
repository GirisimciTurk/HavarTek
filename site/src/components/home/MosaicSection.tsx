import { Frame, Photo } from '@/components/Photo';
import type { Locale } from '@/lib/i18n';
import { photoAlt } from '@/lib/photo-alt';
import type { SlotId } from '@/lib/photos';

/** Yuva sırası ve en-boy oranı tasarımdaki `mosaic` dizisiyle aynı (çift: 3/4, tek: 1/1). */
const tiles: { slot: SlotId; ratio: string }[] = [
  { slot: 'mosaic-0', ratio: '3/4' },
  { slot: 'mosaic-1', ratio: '1/1' },
  { slot: 'mosaic-2', ratio: '3/4' },
  { slot: 'mosaic-3', ratio: '1/1' },
  { slot: 'mosaic-4', ratio: '3/4' },
];

/** Manşetin altındaki dekoratif fotoğraf şeridi — tasarım 71–75. satırlar. */
export function MosaicSection({ locale }: { locale: Locale }) {
  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-0.5 bg-ink">
      {tiles.map((tile) => (
        <Frame key={tile.slot} ratio={tile.ratio}>
          <Photo
            slot={tile.slot}
            alt={photoAlt(locale, tile.slot)}
            sizes="(max-width: 480px) 50vw, (max-width: 900px) 33vw, 20vw"
          />
        </Frame>
      ))}
    </section>
  );
}
