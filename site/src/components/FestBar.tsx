import { getUi } from '@/content/ui';
import type { Locale } from '@/lib/i18n';
import { FEST, festHref } from '@/lib/site';

/**
 * Sayfanın en üstündeki Girişimci Fest duyuru şeridi. Akışta yer kaplar; yüzen
 * menü bunun altından başlar ve kaydırınca yine üste yapışır. Dar ekranda
 * yalnızca ad, tarih ve düğme kalır.
 */
export function FestBar({ locale }: { locale: Locale }) {
  const fest = getUi(locale).fest;

  return (
    <aside aria-label={FEST.name} className="bg-navy text-paper">
      <a
        href={festHref('bar')}
        target="_blank"
        rel="noopener"
        className="group shell flex min-h-10 flex-wrap items-center justify-center gap-x-3 gap-y-0.5 py-2 text-center text-[13px] leading-5 text-paper hover:text-white"
      >
        <span className="font-semibold">{FEST.name}</span>
        <span className="text-paper/70">{fest.when}</span>
        <span className="hidden text-paper/85 md:inline">{fest.pitch}</span>
        <span className="font-semibold text-sky-soft transition-colors group-hover:text-white">
          {fest.cta}
          <span aria-hidden className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </a>
    </aside>
  );
}
