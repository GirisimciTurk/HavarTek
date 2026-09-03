import { Photo, Scrim, scrims } from '@/components/Photo';
import { ButtonLink } from '@/components/ui';
import { getDictionary } from '@/content';
import { pageHref, type Locale } from '@/lib/i18n';
import { photoAlt } from '@/lib/photo-alt';

/**
 * Kapanış çağrısı — tasarım: "DroneTek v4.dc.html" 278–286. satırlar.
 * Tam ekran fotoğraf, üstünde koyu geçiş, içerik alta hizalı.
 */
export function CtaSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="relative grid min-h-[min(80vh,760px)]">
      <Photo slot="cta-bg" alt={photoAlt(locale, 'cta-bg')} sizes="100vw" />
      <Scrim gradient={scrims.cta} />
      {/* Izgara öğesinde z-index `position` gerektirmez; kap `shell` ile ortalanır. */}
      <div className="shell z-10 self-end py-[clamp(56px,7vw,104px)]">
        <h2 className="rise m-0 max-w-[20ch] font-display text-[clamp(32px,5.4vw,76px)] font-extrabold leading-[1.14] tracking-[-0.035em]">
          {t.ctaTitle}
        </h2>
        <p className="m-0 mt-[22px] max-w-[54ch] text-[17px] leading-7 text-paper/80">{t.ctaBody}</p>
        <ButtonLink href={pageHref(locale, 'contact')} className="mt-8">
          {t.form.send}
        </ButtonLink>
      </div>
    </section>
  );
}
