import Link from 'next/link';

import { chipClass, face } from '@/components/ui';
import { getDictionary } from '@/content';
import { cn } from '@/lib/cn';
import { docHref, legalDocKeys, pageHref, type DocKey, type Locale } from '@/lib/i18n';

/**
 * Hukuki / kurumsal doküman sayfası. Uzun metin olduğu için tek dar okuma
 * kolonu (820px). Üst menü akışta 0 yükseklikte olduğu için üst boşluk menüyü
 * de karşılıyor.
 */
export function DocPage({ locale, doc }: { locale: Locale; doc: DocKey }) {
  const t = getDictionary(locale);
  const d = t.docs[doc];

  return (
    <section className="mx-auto max-w-[820px] px-[clamp(20px,4vw,64px)] pt-[clamp(120px,14vw,170px)] pb-[clamp(56px,7vw,96px)]">
      <Link
        href={pageHref(locale, 'home')}
        className="mb-7 inline-block text-[13px] tracking-[0.06em] uppercase text-blue"
      >
        {t.docBack}
      </Link>

      <h1 className={cn(face.bold, 'rise m-0 text-[clamp(30px,4.2vw,54px)] text-ink')}>{d.t}</h1>
      <p className="m-0 mt-4 text-[13px] leading-5 text-faint">{`${t.docUpdated}: ${d.u}`}</p>

      <div className="mt-[clamp(32px,4vw,48px)] flex flex-col">
        {d.s.map((section) => (
          <div key={section.h} className="border-t border-line py-7">
            <h2 className={cn(face.semi, 'm-0 text-[21px] leading-[27px] text-ink')}>{section.h}</h2>
            <div className="mt-3.5 flex flex-col gap-3.5">
              {section.p.map((paragraph) => (
                <p key={paragraph} className="m-0 text-[16px] leading-[27px] text-slate">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* docNav: alt bilgideki üç hukuki doküman arasında geçiş. */}
      <div className="flex flex-wrap gap-2 border-t border-line pt-7">
        {legalDocKeys.map((key) => (
          <Link key={key} href={docHref(locale, key)} className={chipClass(key === doc)}>
            {t.docs[key].t}
          </Link>
        ))}
      </div>
    </section>
  );
}
