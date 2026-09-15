'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { buildVk7 } from '@/components/three/vk7-model';
import { cn } from '@/lib/cn';

export type ViewerLabels = {
  loading: string;
  unsupported: string;
  reset: string;
  autorotate: string;
};

/** Sahne kutusu — yer tutucu ile aynı ölçüde olmalı ki yükleme sırasında zıplamasın. */
export const stageBox = 'relative w-full h-[min(78vh,760px)] min-h-[420px] overflow-hidden bg-white';

/** Sahne üzerindeki açık zeminli düğme; pasifken beyaz, aktifken mavi dolgu. */
const toolbarButton =
  'cursor-pointer rounded-[8px] border border-line-strong px-3 py-[9px] text-[12.5px] font-medium leading-none transition-colors';

type Home = { position: THREE.Vector3; target: THREE.Vector3 };

/** WebGL bağlamı açılamazsa null döner — kurucu hata fırlatır. */
/**
 * WebGL desteğini tek seferde yoklar. Bileşen yalnızca tarayıcıda çizildiği
 * için (`ssr:false`) bu, ilk render'da güvenle çalışabilir; böylece desteğin
 * yokluğu efekt içinde setState ile değil, doğrudan başlangıç değeri olarak
 * belirleniyor.
 */
function supportsWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'));
  } catch {
    return false;
  }
}

function createRenderer(): THREE.WebGLRenderer | null {
  try {
    // preserveDrawingBuffer: son kare kompozitten sonra da okunabilir kalsın —
    // ekran görüntüsü / paylaşım araçları boş tuval yerine sahneyi yakalar
    // (tasarımdaki three-d-stage.js de bu yüzden açıyor).
    return new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
  } catch {
    return null;
  }
}

/**
 * VK-7 modelinin tarayıcıda çizilen 3B görüntüleyicisi.
 *
 * Sahne kurulumu (kamera, stüdyo ışıkları, yumuşak zemin gölgesi, kadraja
 * oturtan kamera konumu, OrbitControls) tasarımdaki `three-d-stage.js`
 * bileşeninden birebir taşındı; dışa aktarma araç çubuğu sitede kullanılmadığı
 * için alınmadı.
 */
export function DroneViewer({ labels }: { labels: ViewerLabels }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<OrbitControls<THREE.PerspectiveCamera> | null>(null);
  const homeRef = useRef<Home | null>(null);
  const [webglSupported] = useState(supportsWebGL);
  // Hareket azaltma tercihi açıksa otomatik dönüş kapalı başlar.
  const [autoRotate, setAutoRotate] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !webglSupported) return;

    const renderer = createRenderer();
    if (!renderer) return;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.outline = 'none';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 500);
    camera.position.set(3, 2.2, 4);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotateSpeed = 1.2;
    controlsRef.current = controls;

    // Nötr stüdyo: yumuşak gök/zemin ışığı, gölge veren ana ışık ve arkadan
    // gelen kısık dolgu — siluet hiçbir açıdan karaya düşmesin.
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2c4, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 7, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0002;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xfff4e6, 0.5);
    fill.position.set(-5, 3, -4);
    scene.add(fill);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ opacity: 0.18 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const drone = buildVk7();
    scene.add(drone);

    // Modeli zemine oturt ve kamerayı sınırlarına göre kadraja al.
    const box = new THREE.Box3().setFromObject(drone);
    if (!box.isEmpty()) {
      ground.position.y = box.min.y;
      const sphere = box.getBoundingSphere(new THREE.Sphere());
      const dist = (sphere.radius / Math.tan((camera.fov * Math.PI) / 360)) * 1.35;
      const dir = new THREE.Vector3(1, 0.55, 1.25).normalize();
      camera.position.copy(sphere.center).add(dir.multiplyScalar(dist));
      camera.near = Math.max(dist / 100, 0.01);
      camera.far = dist * 100;
      camera.updateProjectionMatrix();
      controls.target.copy(sphere.center);
      controls.update();
      const span = sphere.radius * 3;
      key.shadow.camera.left = -span;
      key.shadow.camera.right = span;
      key.shadow.camera.top = span;
      key.shadow.camera.bottom = -span;
      key.shadow.camera.updateProjectionMatrix();
      homeRef.current = { position: camera.position.clone(), target: controls.target.clone() };
    }

    // Hareketi azalt tercihi açıkken tornayı hiç başlatma.

    // Kullanıcı sahneye dokunduğu an otomatik dönüş durur (tasarımdaki davranış).
    const stopAutoRotate = () => {
      controls.autoRotate = false;
      setAutoRotate(false);
    };
    controls.addEventListener('start', stopAutoRotate);

    const fit = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(host);

    let frame = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      controls.update();
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.removeEventListener('start', stopAutoRotate);
      controls.dispose();
      controlsRef.current = null;
      homeRef.current = null;
      // Malzemeler parçalar arasında paylaşıldığı için bir kez bırakılıyor.
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const list = Array.isArray(object.material) ? object.material : [object.material];
        list.forEach((material: THREE.Material) => materials.add(material));
      });
      materials.forEach((material) => material.dispose());
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [webglSupported]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (controls) controls.autoRotate = autoRotate;
  }, [autoRotate]);

  const resetView = useCallback(() => {
    const controls = controlsRef.current;
    const home = homeRef.current;
    if (!controls || !home) return;
    controls.object.position.copy(home.position);
    controls.target.copy(home.target);
    controls.update();
  }, []);

  return (
    <div ref={hostRef} className={stageBox}>
      {!webglSupported ? (
        <p className="absolute inset-0 m-0 flex items-center justify-center px-6 text-center text-[14px] leading-[1.6] text-error">
          {labels.unsupported}
        </p>
      ) : null}

      {webglSupported ? (
        <div className="absolute right-4 bottom-4 flex gap-2">
          <button
            type="button"
            onClick={resetView}
            className={cn(toolbarButton, 'bg-white/92 text-ink hover:bg-white')}
          >
            {labels.reset}
          </button>
          <button
            type="button"
            onClick={() => setAutoRotate((on) => !on)}
            aria-pressed={autoRotate}
            className={cn(
              toolbarButton,
              autoRotate
                ? 'border-transparent bg-blue text-white hover:bg-blue-lift'
                : 'bg-white/92 text-ink hover:bg-white',
            )}
          >
            {labels.autorotate}
          </button>
        </div>
      ) : null}
    </div>
  );
}
