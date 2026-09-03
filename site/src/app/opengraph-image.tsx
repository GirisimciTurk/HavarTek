/* ImageResponse satori ile çiziliyor; next/image burada çalışmaz. */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { ImageResponse } from 'next/og';

import { getDictionary } from '@/content';
import { defaultLocale } from '@/lib/i18n';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'DroneTek';

/** Marka işaretinin gerçek en-boy oranı (632×272) — bozulmadan ölçeklensin. */
const MARK_HEIGHT = 52;
const MARK_WIDTH = Math.round(MARK_HEIGHT * (632 / 272));

/** Fon, build-images.mjs tarafından zaten 1200×630 kırpılmış olarak üretiliyor. */
const BG_WIDTH = 1200;
const BG_HEIGHT = 630;

const PAD_X = 72;

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 800;
  style: 'normal';
};

/**
 * ImageResponse yerel dosya yolu çözemiyor; dosyayı okuyup veri URI'sine
 * çeviriyoruz.
 *
 * Yollar sabit yazılıyor: değişken yol verilirse Turbopack neyin okunacağını
 * çözemez ve tüm projeyi sunucu paketine dahil eder. Kaynaklar bu yüzden
 * `src/og-assets/` altında, küçük ve yalnızca bu iş için üretilmiş hâlleriyle
 * duruyor (bkz. scripts/build-images.mjs).
 */
function toDataUri(result: PromiseSettledResult<Buffer>, mime: string): string | null {
  if (result.status !== 'fulfilled') return null;
  return `data:${mime};base64,${result.value.toString('base64')}`;
}

/**
 * Archivo'yu derleme sırasında Google Fonts'tan indirir.
 *
 * Satori woff2 okuyamadığı için eski bir tarayıcı kimliğiyle istek atıyoruz;
 * Google o zaman ttf sürümünü veriyor. İndirme her nedenle başarısız olursa
 * boş liste döner ve görsel varsayılan yazı tipiyle üretilir — derleme kırılmaz.
 */
async function loadArchivo(): Promise<OgFont[]> {
  try {
    const response = await fetch('https://fonts.googleapis.com/css2?family=Archivo:wght@400;800', {
      headers: { 'User-Agent': 'Mozilla/4.0' },
    });
    if (!response.ok) return [];

    const css = await response.text();
    const faces = [
      ...css.matchAll(/font-weight:\s*(\d+);[\s\S]*?src:\s*url\((https:[^)]+?\.(?:ttf|otf|woff))\)/g),
    ];

    const fonts = await Promise.all(
      faces.map(async (face): Promise<OgFont | null> => {
        const file = await fetch(face[2]);
        if (!file.ok) return null;
        return {
          name: 'Archivo',
          data: await file.arrayBuffer(),
          weight: Number(face[1]) >= 700 ? 800 : 400,
          style: 'normal',
        };
      }),
    );

    return fonts.filter((font): font is OgFont => font !== null);
  } catch {
    return [];
  }
}

/**
 * Sosyal paylaşım görseli (/opengraph-image). Tasarımın manşet düzenini
 * yineliyor: fotoğraf, koyu gradyan ve sol altta marka bloğu.
 */
export default async function OpengraphImage() {
  const t = getDictionary(defaultLocale);

  const [backgroundFile, markFile] = await Promise.allSettled([
    readFile(path.join(process.cwd(), 'src/og-assets/bg.jpg')),
    readFile(path.join(process.cwd(), 'src/og-assets/mark.png')),
  ]);

  const background = toDataUri(backgroundFile, 'image/jpeg');
  const mark = toDataUri(markFile, 'image/png');
  const fonts = await loadArchivo();

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#0B0D0F',
          fontFamily: 'Archivo',
        }}
      >
        {background ? (
          <img
            src={background}
            alt=""
            width={BG_WIDTH}
            height={BG_HEIGHT}
            style={{ position: 'absolute', left: 0, top: 0 }}
          />
        ) : null}

        {/* Tasarımdaki manşet perdesi: alttan koyulaşan gradyan… */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            backgroundImage:
              'linear-gradient(180deg,rgba(11,13,15,.35) 0%,rgba(11,13,15,.55) 40%,rgba(11,13,15,.9) 78%,rgba(11,13,15,.98) 100%)',
          }}
        />
        {/* …ve metnin okunması için soldan gelen ikinci perde. */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            backgroundImage:
              'linear-gradient(90deg,rgba(11,13,15,.88) 0%,rgba(11,13,15,.5) 52%,rgba(11,13,15,.12) 100%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: PAD_X,
            bottom: 66,
            display: 'flex',
            flexDirection: 'column',
            width: size.width - PAD_X * 2,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {mark ? (
              <img
                src={mark}
                alt=""
                width={MARK_WIDTH}
                height={MARK_HEIGHT}
                style={{ marginRight: 20 }}
              />
            ) : null}
            <div
              style={{
                display: 'flex',
                fontSize: 76,
                fontWeight: 800,
                letterSpacing: -1.6,
                color: '#F2F0EC',
              }}
            >
              <span>Drone</span>
              <span style={{ color: '#F0A93B' }}>Tek</span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 26,
              fontSize: 27,
              lineHeight: 1.4,
              color: 'rgba(242,240,236,.78)',
            }}
          >
            {t.ft.desc}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      ...(fonts.length > 0 ? { fonts } : {}),
    },
  );
}
