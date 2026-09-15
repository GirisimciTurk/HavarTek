/* ImageResponse satori ile çiziliyor; next/image burada çalışmaz. */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { ImageResponse } from 'next/og';

import { getDictionary } from '@/content';
import { defaultLocale } from '@/lib/i18n';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'HavarTek.com';

/** Logonun gerçek en-boy oranı (1280×1000) — bozulmadan ölçeklensin. */
const MARK_HEIGHT = 120;
const MARK_WIDTH = Math.round(MARK_HEIGHT * (1280 / 1000));

/** Fon, build-images.mjs tarafından zaten 1200×630 kırpılmış olarak üretiliyor. */
const BG_WIDTH = 1200;
const BG_HEIGHT = 630;

const PAD_X = 72;

/* Kart ölçüleri — satori esnek genişliği kendisi çözmediği için sütun genişliği elle hesaplanıyor. */
const CARD_WIDTH = size.width - PAD_X * 2;
const CARD_PAD_X = 36;
const MARK_GAP = 32;
const TEXT_WIDTH = CARD_WIDTH - CARD_PAD_X * 2 - MARK_WIDTH - MARK_GAP;

/* Tasarım token'ları (globals.css ile aynı) */
const GROUND = '#F4F7FB';
const INK = '#0C1D38';
const MUTED = '#46597A';
const LINE_SOFT = '#DCE7F4';

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
 * Poppins'i derleme sırasında Google Fonts'tan indirir.
 *
 * Satori woff2 okuyamadığı için eski bir tarayıcı kimliğiyle istek atıyoruz;
 * Google o zaman ttf sürümünü veriyor. İndirme her nedenle başarısız olursa
 * boş liste döner ve görsel varsayılan yazı tipiyle üretilir — derleme kırılmaz.
 */
async function loadPoppins(): Promise<OgFont[]> {
  try {
    const response = await fetch('https://fonts.googleapis.com/css2?family=Poppins:wght@400;800', {
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
          name: 'Poppins',
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
 * Sosyal paylaşım görseli (/opengraph-image). Açık tema: manşet fotoğrafı,
 * soldan gelen açık perde ve sol altta logo + marka adını taşıyan beyaz kart.
 */
export default async function OpengraphImage() {
  const t = getDictionary(defaultLocale);

  const [backgroundFile, markFile] = await Promise.allSettled([
    readFile(path.join(process.cwd(), 'src/og-assets/bg.jpg')),
    readFile(path.join(process.cwd(), 'src/og-assets/mark.png')),
  ]);

  const background = toDataUri(backgroundFile, 'image/jpeg');
  const mark = toDataUri(markFile, 'image/png');
  const fonts = await loadPoppins();

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: GROUND,
          fontFamily: 'Poppins',
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

        {/* "Neden hava yolu" bölümündeki perde: soldan gelen açık zemin, fotoğraf sağda kalır. */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            backgroundImage:
              'linear-gradient(90deg,rgba(244,247,251,.96) 0%,rgba(244,247,251,.35) 100%)',
          }}
        />

        {/* Beyaz kart: logo + marka adı + tanım */}
        <div
          style={{
            position: 'absolute',
            left: PAD_X,
            bottom: 66,
            display: 'flex',
            alignItems: 'center',
            width: CARD_WIDTH,
            padding: `30px ${CARD_PAD_X}px`,
            borderRadius: 24,
            border: `1px solid ${LINE_SOFT}`,
            backgroundColor: '#FFFFFF',
          }}
        >
          {mark ? (
            <img
              src={mark}
              alt=""
              width={MARK_WIDTH}
              height={MARK_HEIGHT}
              style={{ marginRight: MARK_GAP, flexShrink: 0 }}
            />
          ) : null}

          <div style={{ display: 'flex', flexDirection: 'column', width: TEXT_WIDTH }}>
            <div
              style={{
                display: 'flex',
                fontSize: 64,
                lineHeight: 1.1,
                fontWeight: 800,
                letterSpacing: -1.4,
                color: INK,
              }}
            >
              HavarTek.com
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 12,
                fontSize: 26,
                lineHeight: 1.4,
                color: MUTED,
              }}
            >
              {t.ft.desc}
            </div>
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
