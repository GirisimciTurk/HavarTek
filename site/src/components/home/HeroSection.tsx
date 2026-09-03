import { Photo, Scrim, scrims } from '@/components/Photo';
import { ButtonLink, display } from '@/components/ui';
import { getDictionary } from '@/content';
import { cn } from '@/lib/cn';
import { pageHref, type Locale } from '@/lib/i18n';
import { photoAlt } from '@/lib/photo-alt';

/** Ana sayfa manşeti — tasarım "DroneTek v4.dc.html", 55–69. satırlar. */
export function HeroSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="relative grid min-h-screen">
      <Photo slot="hero" alt={photoAlt(locale, 'hero')} sizes="100vw" priority />
      <Scrim gradient={scrims.hero} />

      {/* İçerik katmanı fotoğrafın üstünü kaplıyor; tıklamayı yalnızca
          düğmeler alsın diye katman pointer-events:none. */}
      <div className="shell relative self-end pointer-events-none pt-[clamp(56px,8vw,120px)] pb-[clamp(40px,4vw,56px)]">
        <h1 className={cn(display.hero, 'rise m-0 max-w-[20ch]')}>
          <span className="block">{t.hero.l1}</span>
          <span className="block text-amber">{t.hero.l2}</span>
        </h1>
        <p className="m-0 mt-7 max-w-[60ch] text-[17px] leading-[29px] text-paper/76">
          {t.hero.sub}
        </p>
        <div className="pointer-events-auto mt-9 flex flex-wrap gap-3">
          <ButtonLink href={pageHref(locale, 'contact')} variant="primary" size="lg">
            {t.hero.b1}
          </ButtonLink>
          <ButtonLink href={pageHref(locale, 'areas')} variant="ghost" size="lg">
            {t.hero.b2}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
