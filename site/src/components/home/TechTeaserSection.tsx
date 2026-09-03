import { PlatformSpecPicker } from '@/components/home/PlatformSpecPicker';
import { Kicker, face } from '@/components/ui';
import { getDictionary, localizedValue, platformData } from '@/content';
import { getUi } from '@/content/ui';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';

/** Teknik veri bloğu — tasarım "DroneTek v4.dc.html", 137–166. satırlar. */
export function TechTeaserSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const ui = getUi(locale);

  const platforms = platformData.map((p) => ({
    id: p.id,
    type: p.type[locale],
    values: p.values.map((v) => localizedValue(v, locale)),
  }));

  // Sözlük istemciye inmesin diye not metinleri burada kuruluyor.
  const notes: Record<string, string> = Object.fromEntries(
    platformData.map((p) => [p.id, t.note.a + p.id + t.note.b]),
  );

  return (
    <section className="bg-surface">
      <div className="shell section-y grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] items-start gap-[clamp(32px,4vw,72px)]">
        {/* Başlık sunucuda kalıyor, seçime bağlı iki sütunu picker çiziyor. */}
        <PlatformSpecPicker
          platforms={platforms}
          specLabels={t.specLabels}
          notes={notes}
          legend={ui.platformFilterLabel}
        >
          <Kicker>{t.techK}</Kicker>
          <h2 className={cn(face.bold, 'rise m-0 text-[clamp(28px,3.2vw,42px)]')}>
            {t.specTitle}
          </h2>
        </PlatformSpecPicker>
      </div>
    </section>
  );
}
