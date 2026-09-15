import { RequestSection } from '@/components/contact/RequestSection';
import type { Locale } from '@/lib/i18n';

/**
 * İletişim sayfası — tasarımdaki "07 · Talep" bölümünün tamamı. Sayfanın tek
 * bölümü olduğu için başlık h1; yüzen menü nedeniyle üstten boşluklu.
 */
export function ContactPage({ locale }: { locale: Locale }) {
  return <RequestSection locale={locale} headingLevel="h1" topPadding />;
}
