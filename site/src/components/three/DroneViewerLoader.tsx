'use client';

import dynamic from 'next/dynamic';
import { createContext, useContext } from 'react';

import type { ViewerLabels } from '@/components/three/DroneViewer';

/**
 * three.js paketini yalnızca tarayıcıda ve yalnızca bu sayfa açıldığında
 * indiren sarmalayıcı. `next/dynamic` + `ssr:false` sunucu bileşeninden
 * çağrılamadığı için ara katman olarak duruyor.
 */

/** DroneViewer'daki `stageBox` ile aynı ölçü — yükleme sırasında sıçrama olmasın. */
const placeholderBox =
  'relative w-full h-[min(78vh,760px)] min-h-[420px] overflow-hidden bg-white';

/**
 * `dynamic()` modül düzeyinde çağrılmalı; çizim sırasında bileşen üretmek
 * her render'da yeni bir tip yaratır ve ağacı sıfırlar. Yer tutucu metni
 * prop olarak geçirilemediği için bağlam (context) üzerinden veriliyor.
 */
const LoadingLabelContext = createContext('');

function ViewerPlaceholder() {
  const label = useContext(LoadingLabelContext);
  return (
    <div className={placeholderBox}>
      <p className="absolute inset-0 m-0 flex items-center justify-center px-6 text-center text-[14px] text-[rgba(26,25,21,0.55)]">
        {label}
      </p>
    </div>
  );
}

const Viewer = dynamic(
  () => import('@/components/three/DroneViewer').then((m) => m.DroneViewer),
  { ssr: false, loading: ViewerPlaceholder },
);

export function DroneViewerLoader({ labels }: { labels: ViewerLabels }) {
  return (
    <LoadingLabelContext.Provider value={labels.loading}>
      <Viewer labels={labels} />
    </LoadingLabelContext.Provider>
  );
}
