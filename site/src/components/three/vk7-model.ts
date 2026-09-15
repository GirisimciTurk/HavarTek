/**
 * VK-7 sabit kanat platformunun 3B geometrisi.
 *
 * Tasarımdaki "HavarTek 3D.html" modül betiğinden birebir taşındı: profil
 * noktaları, ölçüler, konumlar, dönüşler ve malzeme değerleri aynı. Parça
 * adları da korundu — dışa aktarımda (OBJ/GLB) nesne adı olarak kullanılıyor.
 *
 * Model gerçek dünya ölçüsünde (metre), y-up ve origin merkezli.
 */
import * as THREE from 'three';

export function buildVk7(): THREE.Group {
  const mat = {
    shell: new THREE.MeshStandardMaterial({
      name: 'shell',
      color: 0xe7e3d9,
      roughness: 0.52,
      metalness: 0.14,
    }),
    panel: new THREE.MeshStandardMaterial({
      name: 'panel',
      color: 0x2a2e33,
      roughness: 0.62,
      metalness: 0.22,
    }),
    accent: new THREE.MeshStandardMaterial({
      name: 'accent',
      color: 0xf0a93b,
      roughness: 0.44,
      metalness: 0.18,
    }),
    glass: new THREE.MeshStandardMaterial({
      name: 'glass',
      color: 0x14181c,
      roughness: 0.16,
      metalness: 0.32,
    }),
    rubber: new THREE.MeshStandardMaterial({
      name: 'rubber',
      color: 0x1a1d20,
      roughness: 0.86,
      metalness: 0.04,
    }),
  };

  const drone = new THREE.Group();
  drone.name = 'VK7';

  type Triple = [number, number, number];
  const add = (
    name: string,
    geo: THREE.BufferGeometry,
    material: THREE.Material,
    pos?: Triple,
    rot?: Triple,
  ): THREE.Mesh => {
    const m = new THREE.Mesh(geo, material);
    m.name = name;
    if (pos) m.position.set(pos[0], pos[1], pos[2]);
    if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
    m.castShadow = true;
    m.receiveShadow = true;
    drone.add(m);
    return m;
  };

  // gövde — lathe profili, burun -Z yönünde
  const profilePoints: [number, number][] = [
    [0.0, 0.0],
    [0.02, 0.052],
    [0.06, 0.082],
    [0.12, 0.098],
    [0.3, 0.104],
    [0.6, 0.1],
    [0.85, 0.086],
    [1.05, 0.062],
    [1.19, 0.043],
    [1.25, 0.034],
  ];
  const profile = profilePoints.map(([y, r]) => new THREE.Vector2(r, y));
  const fuse = new THREE.LatheGeometry(profile, 40);
  fuse.rotateX(Math.PI / 2);
  fuse.translate(0, 0, -0.6);
  add('fuselage', fuse, mat.shell);

  // burun kapağı
  const nose = new THREE.SphereGeometry(0.052, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2);
  nose.rotateX(-Math.PI / 2);
  add('noseCap', nose, mat.panel, [0, 0, -0.601]);

  // kanat — tek parça, ok açılı ve sivrilen planform
  const plan = new THREE.Shape();
  plan.moveTo(-1.2, 0.05);
  plan.lineTo(0, 0.17);
  plan.lineTo(1.2, 0.05);
  plan.lineTo(1.2, -0.1);
  plan.lineTo(0, -0.165);
  plan.lineTo(-1.2, -0.1);
  plan.closePath();
  const wing = new THREE.ExtrudeGeometry(plan, {
    depth: 0.036,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.01,
    bevelSegments: 2,
  });
  wing.rotateX(-Math.PI / 2);
  add('wing', wing, mat.shell, [0, 0.095, -0.19]);

  // kanat üzerindeki vurgu şeritleri
  [-1, 1].forEach((sx, i) => {
    const stripe = new THREE.BoxGeometry(0.34, 0.006, 0.1);
    add('wingStripe' + (i + 1), stripe, mat.accent, [sx * 0.8, 0.116, -0.2]);
  });

  // winglet'ler
  [-1, 1].forEach((sx, i) => {
    const wl = new THREE.BoxGeometry(0.02, 0.15, 0.135);
    add('winglet' + (i + 1), wl, mat.panel, [sx * 1.198, 0.163, -0.215], [0, 0, sx * 0.12]);
  });

  // ikiz kuyruk kirişleri
  [-1, 1].forEach((sx, i) => {
    const boom = new THREE.CylinderGeometry(0.021, 0.019, 0.86, 20);
    boom.rotateX(Math.PI / 2);
    add('tailBoom' + (i + 1), boom, mat.panel, [sx * 0.335, 0.095, 0.22]);
  });

  // yatay dengeleyici
  const hstab = new THREE.BoxGeometry(0.76, 0.02, 0.185);
  add('hStabiliser', hstab, mat.shell, [0, 0.095, 0.615]);
  const elevator = new THREE.BoxGeometry(0.76, 0.014, 0.055);
  add('elevator', elevator, mat.panel, [0, 0.095, 0.726]);

  // dikey kanatçıklar
  [-1, 1].forEach((sx, i) => {
    const fin = new THREE.BoxGeometry(0.02, 0.23, 0.155);
    add('vFin' + (i + 1), fin, mat.shell, [sx * 0.335, 0.208, 0.59]);
    const tip = new THREE.BoxGeometry(0.022, 0.03, 0.155);
    add('vFinTip' + (i + 1), tip, mat.accent, [sx * 0.335, 0.331, 0.59]);
  });

  // itici pervane
  const hub = new THREE.CylinderGeometry(0.038, 0.03, 0.07, 24);
  hub.rotateX(Math.PI / 2);
  add('propHub', hub, mat.panel, [0, 0, 0.68]);
  const blade = new THREE.BoxGeometry(0.47, 0.013, 0.058);
  add('propBlade', blade, mat.rubber, [0, 0, 0.712], [0.22, 0, 0]);

  // kamera gimbali
  add('gimbalBall', new THREE.SphereGeometry(0.072, 28, 20), mat.panel, [0, -0.062, -0.4]);
  const lens = new THREE.CylinderGeometry(0.036, 0.036, 0.052, 28);
  lens.rotateX(Math.PI / 2);
  add('lensBarrel', lens, mat.panel, [0, -0.062, -0.455]);
  const glass = new THREE.CylinderGeometry(0.031, 0.031, 0.008, 28);
  glass.rotateX(Math.PI / 2);
  add('lensGlass', glass, mat.glass, [0, -0.062, -0.484]);

  // iniş takımı
  [-1, 1].forEach((sx, i) => {
    const skid = new THREE.CylinderGeometry(0.013, 0.013, 0.42, 16);
    skid.rotateX(Math.PI / 2);
    add('skid' + (i + 1), skid, mat.rubber, [sx * 0.135, -0.19, -0.12]);
    [-0.15, 0.07].forEach((dz, j) => {
      const strut = new THREE.CylinderGeometry(0.01, 0.01, 0.15, 12);
      add(
        'skidStrut' + (i + 1) + (j + 1),
        strut,
        mat.panel,
        [sx * 0.135, -0.118, -0.12 + dz],
        [0, 0, sx * 0.3],
      );
    });
  });

  // anten
  const ant = new THREE.CylinderGeometry(0.005, 0.005, 0.19, 10);
  add('antenna', ant, mat.panel, [0, 0.19, 0.23]);
  add('antennaTip', new THREE.SphereGeometry(0.011, 14, 10), mat.accent, [0, 0.288, 0.23]);

  // burun vurgu halkası
  const ring = new THREE.TorusGeometry(0.099, 0.007, 12, 40);
  add('noseRing', ring, mat.accent, [0, 0, -0.36]);

  drone.position.y = 0.203;
  return drone;
}
