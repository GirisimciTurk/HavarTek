import { headers } from 'next/headers';

import { NotFoundView } from '@/components/NotFoundView';
import { defaultLocale, isLocale, LOCALE_HEADER, type Locale } from '@/lib/i18n';

/**
 * 404 sınırı sunucu bileşeni olmak zorunda; içinde istemci bileşeni çizilmiyor.
 * Dil `params` ile gelmediği için proxy'nin eklediği başlıktan okunuyor.
 */
export default async function NotFound() {
  const value = (await headers()).get(LOCALE_HEADER) ?? '';
  const locale: Locale = isLocale(value) ? value : defaultLocale;
  return <NotFoundView locale={locale} />;
}
