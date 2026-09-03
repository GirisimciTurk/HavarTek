import { AreasSection } from '@/components/home/AreasSection';
import { CaseSection } from '@/components/home/CaseSection';
import { CtaSection } from '@/components/home/CtaSection';
import { DisasterSection } from '@/components/home/DisasterSection';
import { HeroSection } from '@/components/home/HeroSection';
import { JoinSection } from '@/components/home/JoinSection';
import { MissionSection } from '@/components/home/MissionSection';
import { MosaicSection } from '@/components/home/MosaicSection';
import { NewsSection } from '@/components/home/NewsSection';
import { OpportunitySection } from '@/components/home/OpportunitySection';
import { RegulationSection } from '@/components/home/RegulationSection';
import { StatsSection } from '@/components/home/StatsSection';
import { StepsSection } from '@/components/home/StepsSection';
import { TechTeaserSection } from '@/components/home/TechTeaserSection';
import type { Locale } from '@/lib/i18n';

/**
 * Ana sayfa. Bölümlerin sırası tasarımdaki ("DroneTek v4.dc.html", 53–288.
 * satırlar) sırayla birebir aynı.
 */
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <HeroSection locale={locale} />
      <MosaicSection locale={locale} />
      <StatsSection locale={locale} />
      <MissionSection locale={locale} />
      <AreasSection locale={locale} />
      <TechTeaserSection locale={locale} />
      <StepsSection locale={locale} />
      <CaseSection locale={locale} />
      <DisasterSection locale={locale} />
      <OpportunitySection locale={locale} />
      <RegulationSection locale={locale} />
      <NewsSection locale={locale} />
      <JoinSection locale={locale} />
      <CtaSection locale={locale} />
    </>
  );
}
