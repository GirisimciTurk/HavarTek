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
 * Görünüm alt sayfa manşetleriyle aynı: lacivert şerit, açık yazı; üst menü
 * akışta 0 yükseklikte olduğu için üst boşluk menüyü de karşılıyor.
 */
export function NotFoundView({ locale }: { locale: Locale }) {
  const ui = getUi(locale);

  return (
    <section className="relative grid min-h-[min(78vh,700px)] bg-navy">
      <Photo slot="not-found" alt={photoAlt(locale, 'not-found')} sizes="100vw" priority />
      <Scrim gradient={scrims.pageHeader} />
      <div className="shell relative self-end pt-[clamp(120px,14vw,180px)] pb-[clamp(56px,7vw,104px)]">
        <span className="mb-[18px] block text-[12px] uppercase tracking-[0.16em] text-sky-soft tnum">
          {ui.notFound.code}
        </span>
        <h1 className={`${display.section} m-0 max-w-[22ch] text-white`}>{ui.notFound.title}</h1>
        <p className="m-0 mt-5 max-w-[54ch] text-[17px] leading-7 text-paper/80">
          {ui.notFound.body}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={pageHref(locale, 'home')}>{ui.notFound.home}</ButtonLink>
          <ButtonLink href={pageHref(locale, 'contact')} variant="outline">
            {ui.notFound.contact}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
