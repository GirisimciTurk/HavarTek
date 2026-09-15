import { RequestSection } from '@/components/contact/RequestSection';
import { AreasSection } from '@/components/home/AreasSection';
import { HeroSection } from '@/components/home/HeroSection';
import { MissionSection } from '@/components/home/MissionSection';
import { NewsSection } from '@/components/home/NewsSection';
import { PromiseSection } from '@/components/home/PromiseSection';
import { StepsSection } from '@/components/home/StepsSection';
import { StoriesSection } from '@/components/home/StoriesSection';
import { WhyAirSection } from '@/components/home/WhyAirSection';
import type { Locale } from '@/lib/i18n';

/**
 * Ana sayfa. Bölümlerin sırası tasarımdaki ("HavarTek Aydınlık Tema.dc.html",
 * 90–410. satırlar) sırayla birebir aynı. Menüdeki "#alanlar" ve "#iletisim"
 * çapaları AreasSection ve RequestSection üstünde.
 */
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <HeroSection locale={locale} />
      <PromiseSection locale={locale} />
      <MissionSection locale={locale} />
      <AreasSection locale={locale} />
      <StepsSection locale={locale} />
      <StoriesSection locale={locale} />
      <WhyAirSection locale={locale} />
      <NewsSection locale={locale} />
      <RequestSection locale={locale} id="iletisim" />
    </>
  );
}
