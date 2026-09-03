import { Photo, Scrim, scrims } from '@/components/Photo';
import { ButtonLink, display } from '@/components/ui';
import { getUi } from '@/content/ui';
import { pageHref, type Locale } from '@/lib/i18n';
import { photoAlt } from '@/lib/photo-alt';

/**
 * 404 sayfasının görünümü — SUNUCU bileşeni.
 *
 * `not-found.tsx` sınırının içinde istemci bileşenleri çizilmiyor (Next 16,
 * kök yerleşim dinamik segment altındayken), bu yüzden hiç kanca kullanmıyor.
 */
export function NotFoundView({ locale }: { locale: Locale }) {
  const ui = getUi(locale);

  return (
    <section className="relative grid min-h-[min(78vh,700px)]">
      <Photo slot="cta-bg" alt={photoAlt(locale, 'cta-bg')} sizes="100vw" priority />
      <Scrim gradient={scrims.cta} />
      <div className="shell relative self-end py-[clamp(56px,7vw,104px)]">
        <span className="kicker mb-5 tnum">{ui.notFound.code}</span>
        <h1 className={`${display.section} m-0 max-w-[22ch]`}>{ui.notFound.title}</h1>
        <p className="m-0 mt-5 max-w-[54ch] text-[17px] leading-7 text-paper/80">
          {ui.notFound.body}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={pageHref(locale, 'home')}>{ui.notFound.home}</ButtonLink>
          <ButtonLink href={pageHref(locale, 'contact')} variant="ghost">
            {ui.notFound.contact}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
