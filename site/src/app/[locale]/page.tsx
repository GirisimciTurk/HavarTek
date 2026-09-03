import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { HomePage } from '@/components/pages/HomePage';
import { isLocale, type Locale } from '@/lib/i18n';
import { metadataFor } from '@/lib/page-meta';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  return metadataFor(raw, { kind: 'home' });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  return <HomePage locale={locale} />;
}
