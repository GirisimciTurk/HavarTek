/**
 * llms.txt ve llms-full.txt — yapay zekâ yanıt motorları için sitenin düz
 * Markdown özeti (https://llmstxt.org). İçerik site.json'dan üretilir; metin
 * değişince bu dosyalar da derlemeyle kendiliğinden güncellenir.
 */
import { getDictionary, localizedValue, platformData } from '@/content';
import { getUi } from '@/content/ui';
import { allRoutes, href, locales, type DocKey, type Locale, type Route } from '@/lib/i18n';
import { routeMeta } from '@/lib/page-meta';
import { absolute, FEST, ORG, siteUrl } from '@/lib/site';

/** Yanıt motorları için anlamlı dokümanlar; çerez/KVKK gibi hukuki metinler llms-full'a girmez. */
const fullDocs: DocKey[] = ['hakkimizda', 'shgm', 'takip', 'sozlesme'];

const headings: Record<Locale, { pages: string; docs: string; optional: string; full: string }> = {
  tr: {
    pages: 'Sayfalar (Türkçe)',
    docs: 'Kurumsal ve hukuki (Türkçe)',
    optional: 'Optional',
    full: 'Sitenin tüm içeriği tek dosyada (Markdown)',
  },
  en: {
    pages: 'Pages (English)',
    docs: 'Company and legal (English)',
    optional: 'Optional',
    full: 'The full site content in a single file (Markdown)',
  },
};

function routeName(locale: Locale, route: Route): string {
  const t = getDictionary(locale);
  if (route.kind === 'doc') return t.docs[route.doc].t;
  if (route.kind === 'model3d') return t.nav3d;
  return t.nav[route.kind];
}

function linkLine(locale: Locale, route: Route): string {
  const { description } = routeMeta(locale, route);
  return `- [${routeName(locale, route)}](${absolute(href(locale, route))}): ${description}`;
}

function contactLine(locale: Locale): string {
  const label = locale === 'en' ? 'Contact' : 'İletişim';
  const phone = locale === 'en' ? ORG.phoneIntl : ORG.phone;
  return `${label}: ${phone} · ${ORG.email} · WhatsApp +${ORG.whatsappRaw} · ${ORG.address.district} / ${ORG.address.city}`;
}

/** /llms.txt — kısa özet ve sayfa haritası. */
export function llmsIndex(): string {
  const tr = getDictionary('tr');
  const lines: string[] = [
    `# ${ORG.name}`,
    '',
    `> ${getUi('tr').seo.home.description}`,
    '',
    tr.docs.hakkimizda.s[0].p[0],
    '',
    `${ORG.legalName} — ${contactLine('tr')}`,
    '',
    `English: ${getUi('en').seo.home.description}`,
  ];

  for (const locale of locales) {
    const routes = allRoutes();
    lines.push('', `## ${headings[locale].pages}`, '');
    for (const route of routes.filter((r) => r.kind !== 'doc')) lines.push(linkLine(locale, route));
    lines.push('', `## ${headings[locale].docs}`, '');
    for (const route of routes.filter((r) => r.kind === 'doc')) lines.push(linkLine(locale, route));
  }

  lines.push(
    '',
    '## Optional',
    '',
    `- [llms-full.txt](${absolute('/llms-full.txt')}): ${headings.tr.full} / ${headings.en.full}`,
    `- [${FEST.name}](${FEST.url}): ${getUi('tr').fest.when} — ${getUi('tr').fest.pitch}`,
    '',
  );
  return lines.join('\n');
}

/** Bir dilin tüm içeriği, sayfa sırasıyla Markdown olarak. */
function fullContent(locale: Locale): string[] {
  const t = getDictionary(locale);
  const ui = getUi(locale);
  const page = (kind: Route['kind']) => absolute(href(locale, { kind } as Route));
  const out: string[] = [];
  const section = (title: string, url?: string) =>
    out.push('', `## ${title}`, ...(url ? ['', `URL: ${url}`] : []), '');

  section(`${t.hero.l1} ${t.hero.l2}`, page('home'));
  out.push(t.hero.sub);

  out.push('', `### ${t.promiseTitle}`, '');
  for (const item of t.promiseItems) out.push(`- **${item.t}** — ${item.b}`);

  out.push('', `### ${t.missionTitle}`, '', t.missionLead, '');
  for (const item of t.missionItems) out.push(`- **${item.t}** — ${item.b} ${item.n}`);

  out.push('', `### ${t.stepsTitle}`, '');
  for (const step of t.steps) out.push(`${Number(step.n)}. **${step.t}** — ${step.b}`);

  out.push('', `### ${t.storiesTitle}`, '', t.storiesLead, '');
  for (const story of t.stories) out.push(`- **${story.t}** (${story.who}) — ${story.p} ${story.s}`);

  out.push('', `### ${t.whyTitle}`, '');
  for (const item of t.whyItems) out.push(`- ${item}`);

  out.push('', `### ${t.newsTitle}`, '');
  for (const item of t.news) out.push(`- **${item.t}** (${item.tag}) — ${item.b}`);

  out.push('', `### ${t.faqTitle}`, '');
  for (const item of t.faq) out.push(`**${item.q}**`, '', item.a, '');

  section(t.apTitle, page('areas'));
  out.push(t.apLead);
  for (const area of t.areas) {
    out.push('', `### ${area.title} (${area.catLabel})`, '', area.body, '', `${t.deliver}:`);
    for (const item of area.items) out.push(`- ${item}`);
  }

  section(t.tpTitle, page('tech'));
  out.push(t.tpLead, '', `### ${t.matrixTitle}`, '');
  out.push(`| ${t.cols.prop} | ${platformData.map((p) => `${p.id} (${p.type[locale]})`).join(' | ')} |`);
  out.push(`| --- | ${platformData.map(() => '---').join(' | ')} |`);
  t.specLabels.forEach((label, row) => {
    const values = platformData.map((p) => localizedValue(p.values[row], locale));
    out.push(`| ${label.p} (${label.r}) | ${values.join(' | ')} |`);
  });
  out.push('', `### ${t.payloadTitle}`, '');
  for (const item of t.payloads) out.push(`- **${item.t}** — ${item.b}`);
  out.push('', `### ${t.swTitle}`, '');
  for (const item of t.sw) out.push(`- **${item.t}** — ${item.b}`);

  section(t.reqTitle, page('contact'));
  out.push(t.reqBody, '');
  for (const item of t.afterItems) out.push(`- ${item}`);
  out.push('', contactLine(locale));

  for (const key of fullDocs) {
    const doc = t.docs[key];
    section(doc.t, absolute(href(locale, { kind: 'doc', doc: key })));
    out.push(`${t.docUpdated}: ${doc.u}`);
    for (const part of doc.s) out.push('', `### ${part.h}`, '', ...part.p.flatMap((p) => [p, '']));
  }

  out.push('', `## ${FEST.name}`, '', `${ui.fest.when}. ${ui.fest.pitch} ${FEST.url}`);
  return out;
}

/** /llms-full.txt — iki dilde tüm içerik. */
export function llmsFull(): string {
  const lines = [`# ${ORG.name}`, '', `> ${getUi('tr').seo.home.description}`, '', `${siteUrl}`];
  for (const locale of locales) {
    lines.push('', '---', '', `# ${ORG.name} — ${locale === 'en' ? 'English' : 'Türkçe'}`);
    lines.push(...fullContent(locale));
  }
  // Fazla boş satırları tekile indir.
  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}
