import { platformData } from '@/content';
import { getUi } from '@/content/ui';
import { DroneViewerLoader } from '@/components/three/DroneViewerLoader';
import { ButtonLink, display, Kicker } from '@/components/ui';
import { cn } from '@/lib/cn';
import { pageHref, type Locale } from '@/lib/i18n';

/**
 * VK-7 3B model sayfası. Sahne tarayıcıda çizildiği için görüntüleyici
 * istemci tarafında yükleniyor. Üst menü akışta 0 yükseklikte olduğu için
 * üst boşluk menüyü de karşılıyor.
 */
export function Model3dPage({ locale }: { locale: Locale }) {
  const ui = getUi(locale).model3d;
  const vk7 = platformData.find((platform) => platform.id === 'VK-7');
  const kicker = vk7 ? `${vk7.id} · ${vk7.type[locale]}` : 'VK-7';

  return (
    <>
      <div className="shell pt-[clamp(120px,14vw,170px)] pb-[clamp(24px,3vw,40px)]">
        <Kicker>{kicker}</Kicker>
        <h1 className={cn(display.sectionSm, 'rise m-0 text-ink')}>{ui.title}</h1>
        <p className="m-0 mt-6 max-w-[58ch] text-[17px] leading-[28px] text-muted">{ui.lead}</p>
      </div>

      <DroneViewerLoader
        labels={{
          loading: ui.loading,
          unsupported: ui.unsupported,
          reset: ui.reset,
          autorotate: ui.autorotate,
        }}
      />

      {/* Çizgi tam genişlikte; ipuçları shell hizasında kalır. */}
      <div className="border-t border-line">
        <div className="shell flex flex-wrap items-center gap-x-7 gap-y-2 pt-3.5 text-[14px] text-muted">
          {ui.hints.map((hint) => (
            <span key={hint}>{hint}</span>
          ))}
        </div>
      </div>

      <div className="shell pt-7 pb-[clamp(48px,6vw,88px)]">
        <ButtonLink href={pageHref(locale, 'tech')} variant="ghost" size="md">
          {ui.backToTech}
        </ButtonLink>
      </div>
    </>
  );
}
