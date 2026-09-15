/**
 * Site simgelerini üretir: favicon, PWA simgeleri, public/logo.png ve sosyal
 * paylaşım görselinin kaynakları.
 *
 *   npm run images
 *
 * Kaynak: src/assets/havartek-logo.webp (1280×1000, şeffaf zemin; üstte mavi
 * drone işareti, altta lacivert "HAVARTEK.com" yazısı). Logo açık zemin
 * istediği için simgeler BEYAZ kare üzerine yerleştirilir. Favicon ve PWA
 * simgelerinde küçük ölçekte okunmayan yazı atılır, yalnızca üstteki drone
 * işareti kullanılır; public/logo.png ve og/mark.png tam logodur.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'src/assets/havartek-logo.webp');
const publicDir = path.join(root, 'public');

const WHITE = { r: 0xff, g: 0xff, b: 0xff, alpha: 1 };
const TRANSPARENT = { ...WHITE, alpha: 0 };

/**
 * Drone işaretinin kaynak logodaki yeri, 1280×1000 ölçüsüne göre. Pervane
 * uçları iki yana kadar uzandığı için tam genişlik; yazı 588. satırda
 * başlıyor, aradaki boşluk 524–587 (alfa kanalından ölçüldü).
 */
const MARK_REGION = { left: 0, top: 0, width: 1280, height: 524, sourceWidth: 1280 };

/** Kaynak ölçüsü değiştiyse bölgeyi aynı oranla ölçekler. */
async function markRegion() {
  const { width } = await sharp(source).metadata();
  const scale = width / MARK_REGION.sourceWidth;
  return {
    left: Math.round(MARK_REGION.left * scale),
    top: Math.round(MARK_REGION.top * scale),
    width: Math.round(MARK_REGION.width * scale),
    height: Math.round(MARK_REGION.height * scale),
  };
}

/** Şeffaf zeminli drone işareti (logonun üst parçası). */
async function markBuffer() {
  return sharp(source).extract(await markRegion()).png().toBuffer();
}

/**
 * Verilen görseli kare beyaz zemine ortalayarak `size` boyutunda PNG üretir.
 * `padding`, kenar payının kare kenarına oranı.
 */
async function icon(input, size, { padding = 0.18, background = WHITE } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const artwork = await sharp(input)
    .resize({ width: inner, height: inner, fit: 'contain', background: TRANSPARENT })
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: artwork, gravity: 'center' }])
    .png()
    .toBuffer();
}

async function main() {
  await mkdir(publicDir, { recursive: true });

  const mark = await markBuffer();

  // İşaret geniş (yaklaşık 2.4:1) olduğu için kare simgelerde kenar payı dar
  // tutuluyor; aksi hâlde sekmede ince bir çizgi gibi kalıyor.
  // Tarayıcı sekmesi (ICO içine 32 ve 16 piksellik kareler) — yalnızca drone işareti
  const ico32 = await icon(mark, 32, { padding: 0.06 });
  const ico16 = await icon(mark, 16, { padding: 0.04 });
  await writeFile(path.join(publicDir, 'favicon.ico'), await toIco([ico16, ico32]));

  await writeFile(path.join(publicDir, 'icon.png'), await icon(mark, 512, { padding: 0.12 }));
  await writeFile(path.join(publicDir, 'apple-icon.png'), await icon(mark, 180, { padding: 0.1 }));

  // Yapılandırılmış veride kullanılan kurum logosu — tam logo
  await writeFile(path.join(publicDir, 'logo.png'), await icon(source, 512, { padding: 0.1 }));

  // Sosyal paylaşım görselinin kaynakları ayrı, küçük bir klasörde tutulur:
  // opengraph-image.tsx bunları derleme sırasında okur ve Turbopack yalnızca
  // bu klasörü izler (src/assets'in tamamı sunucu paketine girmesin).
  const ogDir = path.join(root, 'src/og-assets');
  await mkdir(ogDir, { recursive: true });

  // Fon: ana sayfa manşeti (solda trafik, sağda drone), 1200×630 kırpılmış
  await sharp(path.join(root, 'src/assets/photos/hero-split.jpeg'))
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'center' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(ogDir, 'bg.jpg'));

  // Tam logo, şeffaf zemin; beyaz kartın içine opengraph-image.tsx yerleştiriyor
  await sharp(source).resize({ height: 240 }).png().toFile(path.join(ogDir, 'mark.png'));

  await writeFile(
    path.join(publicDir, 'manifest.webmanifest'),
    `${JSON.stringify(
      {
        name: 'HavarTek.com',
        short_name: 'HavarTek',
        description:
          'Drone tabanlı ulaşım sistemleri için mühendislik ve girişimcilik platformu.',
        start_url: '/tr',
        display: 'standalone',
        background_color: '#FFFFFF',
        theme_color: '#F4F7FB',
        icons: [
          { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
        ],
      },
      null,
      2,
    )}\n`,
  );

  console.log('Simgeler üretildi → public/, src/og-assets/');
}

/** Birkaç PNG'yi tek bir .ico dosyasına paketler. */
async function toIco(pngBuffers) {
  const entries = await Promise.all(
    pngBuffers.map(async (png) => {
      const { width, height } = await sharp(png).metadata();
      return { png, width, height };
    }),
  );

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);

  const directory = Buffer.alloc(16 * entries.length);
  let offset = header.length + directory.length;

  entries.forEach((entry, index) => {
    const at = index * 16;
    directory.writeUInt8(entry.width >= 256 ? 0 : entry.width, at);
    directory.writeUInt8(entry.height >= 256 ? 0 : entry.height, at + 1);
    directory.writeUInt8(0, at + 2); // palette
    directory.writeUInt8(0, at + 3); // reserved
    directory.writeUInt16LE(1, at + 4); // colour planes
    directory.writeUInt16LE(32, at + 6); // bits per pixel
    directory.writeUInt32LE(entry.png.length, at + 8);
    directory.writeUInt32LE(offset, at + 12);
    offset += entry.png.length;
  });

  return Buffer.concat([header, directory, ...entries.map((entry) => entry.png)]);
}

await main();
