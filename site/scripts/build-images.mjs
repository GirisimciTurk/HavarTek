/**
 * Site simgelerini üretir: favicon, PWA simgeleri ve public/logo.png.
 *
 *   npm run images
 *
 * Kaynak: src/assets/logo-white.png (şeffaf zeminde beyaz marka işareti).
 * Simgeler koyu zemin (#0B0D0F) üzerine yerleştirilir; beyaz işaret açık renkli
 * tarayıcı sekmelerinde kaybolmasın diye.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'src/assets/logo-white.png');
const publicDir = path.join(root, 'public');

const INK = { r: 0x0b, g: 0x0d, b: 0x0f, alpha: 1 };

/** Marka işaretini kare koyu zemine ortalayarak `size` boyutunda PNG üretir. */
async function icon(size, { padding = 0.18, background = INK } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const mark = await sharp(source)
    .resize({ width: inner, height: inner, fit: 'contain', background: { ...INK, alpha: 0 } })
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toBuffer();
}

async function main() {
  await mkdir(publicDir, { recursive: true });

  // Tarayıcı sekmesi (ICO içine 32 ve 16 piksellik kareler)
  const ico32 = await icon(32, { padding: 0.12 });
  const ico16 = await icon(16, { padding: 0.1 });
  await writeFile(path.join(publicDir, 'favicon.ico'), await toIco([ico16, ico32]));

  await writeFile(path.join(publicDir, 'icon.png'), await icon(512));
  await writeFile(path.join(publicDir, 'apple-icon.png'), await icon(180, { padding: 0.14 }));

  // Yapılandırılmış veride kullanılan kurum logosu
  await writeFile(path.join(publicDir, 'logo.png'), await icon(512, { padding: 0.1 }));

  // Sosyal paylaşım görselinin kaynakları ayrı, küçük bir klasörde tutulur:
  // opengraph-image.tsx bunları derleme sırasında okur ve Turbopack yalnızca
  // bu klasörü izler (src/assets'in tamamı sunucu paketine girmesin).
  const ogDir = path.join(root, 'src/og-assets');
  await mkdir(ogDir, { recursive: true });

  await sharp(path.join(root, 'src/assets/photos/gemini-city.jpeg'))
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'center' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(ogDir, 'bg.jpg'));

  await sharp(source).resize({ height: 104 }).png().toFile(path.join(ogDir, 'mark.png'));

  await writeFile(
    path.join(publicDir, 'manifest.webmanifest'),
    `${JSON.stringify(
      {
        name: 'DroneTek',
        short_name: 'DroneTek',
        description:
          'Paket, kargo ve insan taşımacılığı için drone tabanlı ulaşım sistemleri.',
        start_url: '/tr',
        display: 'standalone',
        background_color: '#0B0D0F',
        theme_color: '#0B0D0F',
        icons: [
          { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
        ],
      },
      null,
      2,
    )}\n`,
  );

  console.log('Simgeler üretildi → public/');
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
