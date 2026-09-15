import { PhotoFrame } from '@/components/Photo';
import { StoriesAccordion } from '@/components/home/StoriesAccordion';
import { ButtonLink } from '@/components/ui';
import { getDictionary } from '@/content';
import { pageHref, type Locale } from '@/lib/i18n';
import { photoAlt } from '@/lib/photo-alt';

/**
 * "Sahadan durumlar" — tasarım "HavarTek Aydınlık Tema.dc.html", 232–265.
 * satırlar. Tasarımda Süreç bölümünün devamı olduğu için üst boşluğu
 * oradaki `margin-top:clamp(56px,6vw,88px)` ile aynı.
 *
 * Sol sütun kaydırırken yapışkan kalır (üst menünün altında, 110px);
 * sağda istemci tarafı akordeon. Metinler prop olarak geçiyor.
 */
export function StoriesSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="shell pt-[clamp(56px,6vw,88px)] pb-[clamp(64px,7vw,104px)]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-start gap-[clamp(24px,3vw,56px)]">
        <div className="sticky top-[110px] min-w-0">
          <span className="kicker-sm mb-3.5 text-blue">{t.storiesK}</span>
          {/* face.bold'un satır yüksekliği (1.14) tasarımdakinden farklı;
              çakışan iki leading yazmamak için yüz elle açıldı. */}
          <h3 className="m-0 max-w-[20ch] font-display text-[clamp(24px,2.6vw,34px)] leading-[1.18] font-extrabold tracking-[-0.018em]">
            {t.storiesTitle}
          </h3>
          <p className="m-0 mt-4 max-w-[46ch] text-[15px] leading-[25px] text-muted">
            {t.storiesLead}
          </p>
          <PhotoFrame
            ratio="4/3"
            slot="stories"
            alt={photoAlt(locale, 'stories')}
            sizes="(max-width: 700px) 100vw, 50vw"
            frameClassName="mt-7 rounded-2xl"
          />
          <ButtonLink href={pageHref(locale, 'contact')} variant="primary" size="lg" className="mt-6">
            {t.storiesCta}
          </ButtonLink>
        </div>

        <StoriesAccordion stories={t.stories} />
      </div>
    </section>
  );
}
