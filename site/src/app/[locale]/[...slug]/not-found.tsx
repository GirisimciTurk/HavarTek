import { NotFoundView } from '@/components/NotFoundView';
import { locales } from '@/lib/i18n';

/**
 * 404 sınırı `params` alamıyor. Dili istek başlığından okumak (`headers()`)
 * bütün [locale] ağacını dinamik çizime zorluyordu; bunun yerine her dilin
 * görünümü basılıyor ve yerleşimin <html lang> değerine uymayanı CSS ile
 * gizleniyor (bkz. globals.css → [data-locale-only]).
 */
export default function NotFound() {
  return locales.map((locale) => (
    <div key={locale} data-locale-only={locale}>
      <NotFoundView locale={locale} />
    </div>
  ));
}
