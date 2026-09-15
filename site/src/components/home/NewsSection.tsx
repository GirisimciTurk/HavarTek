import { Kicker, face } from '@/components/ui';
import { getDictionary } from '@/content';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';

/**
 * "06 · Gündem" — tasarım "HavarTek Aydınlık Tema.dc.html", 283–305. satırlar.
 * Üç beyaz metin kartı: etiket, başlık ve özet. Fotoğraf ve tarih yok.
 */
export function NewsSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="shell section-y">
      <Kicker>{t.newsK}</Kicker>
      <h2 className={cn(face.bold, 'rise m-0 max-w-[24ch] text-[clamp(28px,3.2vw,44px)]')}>
        {t.newsTitle}
      </h2>

      <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[clamp(16px,2vw,28px)]">
        {t.news.map((item) => (
          <article key={item.t} className="rounded-2xl border border-line-soft bg-white p-7">
            <span className="kicker-sm mb-3.5 text-blue">{item.tag}</span>
            <h3 className={cn(face.semi, 'm-0 text-[20px] leading-[26px]')}>{item.t}</h3>
            <p className="m-0 mt-3 text-[15px] leading-6 text-muted">{item.b}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
