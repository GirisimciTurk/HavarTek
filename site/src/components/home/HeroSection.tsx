import { Photo } from '@/components/Photo';
import { display } from '@/components/ui';
import { getDictionary } from '@/content';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';
import { photoAlt } from '@/lib/photo-alt';

/**
 * Ana sayfa manşeti — tasarım "HavarTek Aydınlık Tema.dc.html", 90–101. satırlar.
 *
 * Fotoğraf tam kaplıyor; metin ortada, cam etkili lacivert bir kartın içinde.
 * Üst menü akışta yer kaplamadığı için üst boşluk menüyü de karşılıyor.
 * Tasarımda düğme yok.
 */
export function HeroSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="relative grid min-h-[min(100vh,940px)]">
      <Photo slot="hero" alt={photoAlt(locale, 'hero')} sizes="100vw" priority />

      <div className="shell relative flex justify-center self-center pt-[clamp(96px,10vw,150px)] pb-[clamp(40px,6vw,88px)]">
        <div className="max-w-[760px] rounded-3xl border border-white/22 bg-navy/42 p-[clamp(26px,3vw,40px)] backdrop-blur-[10px]">
          <h1 className={cn(display.hero, 'rise m-0 max-w-[20ch] text-white')}>
            <span className="block">{t.hero.l1}</span>
            <span className="block text-sky">{t.hero.l2}</span>
          </h1>
          <p className="m-0 mt-6 max-w-[60ch] text-[16px] leading-[27px] text-paper-soft">
            {t.hero.sub}
          </p>
        </div>
      </div>
    </section>
  );
}
