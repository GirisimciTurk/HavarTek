# DroneTek kurumsal sitesi

DroneTek'in iki dilli (TR/EN) kurumsal sitesi. Kaynak tasarım, Claude Design canvas
dosyası **`DroneTek v4.dc.html`**; buradaki tüm ölçüler, renkler, boşluklar ve hover
davranışları koda birebir aktarıldı. Sitedeki her metin tasarımın `content` nesnesinden
programla çıkarılıp `src/content/site.json` içine taşındı — kodda elle yazılmış
Türkçe/İngilizce metin yoktur.

**Teknoloji yığını**

| Katman | Seçim |
| --- | --- |
| Çatı | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Stil | Tailwind CSS v4 (`@tailwindcss/postcss`), `src/app/globals.css` içinde tema |
| Yazı tipi | `next/font/google` — Archivo (başlık) + Instrument Sans (gövde) |
| Görsel | `next/image` + `sharp` (AVIF/WebP, statik import, blur ön izleme) |
| 3B model | `three` (yalnızca 3B model sayfasında, istemci tarafında) |
| E-posta | `nodemailer` (iletişim ve bülten formu uçları) |
| Çıktı | `output: 'standalone'` — tek klasörde çalışan Node sunucusu |

---

## Klasör düzeni

```
site/
├─ src/
│  ├─ app/                 Rotalar (App Router)
│  │  ├─ [locale]/layout.tsx     Kabuk: başlık, alt bilgi, yazı tipleri, meta
│  │  ├─ [locale]/page.tsx       Ana sayfa
│  │  ├─ [locale]/[...slug]/     Rota tablosundan çözülen alt sayfa ve dokümanlar
│  │  ├─ api/                    Form uçları (/api/contact, /api/newsletter)
│  │  └─ globals.css             Tailwind teması + `shell`, `section-y`, `rise` …
│  ├─ components/          Arayüz: SiteHeader, SiteFooter, Photo, ui.tsx
│  │  └─ pages/            Sayfa gövdeleri (HomePage, AreasPage …)
│  ├─ content/             site.json (metinler) + index.ts + ui.ts
│  ├─ lib/                 i18n.ts, photos.ts, site.ts, page-meta.ts, cn.ts
│  ├─ assets/              logo + photos/ (kaynak fotoğraflar)
│  └─ proxy.ts             Dil ön eki yoksa /tr veya /en'e yönlendirir
├─ public/                 Üretilmiş simgeler, manifest (bkz. `npm run images`)
├─ scripts/build-images.mjs
├─ deploy/                 nginx.conf, dronetek.service
├─ Dockerfile · docker-compose.yml · .dockerignore
└─ .env.example
```

---

## İçerik nasıl güncellenir

**Tek doğruluk kaynağı: `src/content/site.json`.** İçinde `content.tr` ve `content.en`
aynı yapıyla durur; bir metni değiştirmek için iki dildeki karşılığını da düzenleyin.
Kod bu dosyaya yalnızca `getDictionary(locale)` ile erişir:

```ts
import { getDictionary } from '@/content';
const t = getDictionary(locale);   //  t.hero.title, t.areas[0].title …
```

Tasarımda karşılığı olmayan arayüz metinleri (mobil menü, form durumları, 404, SEO
açıklamaları) `src/content/ui.ts` içindedir → `getUi(locale)`.

> `getDictionary` yalnızca sunucu bileşenlerinde kullanılır; `site.json` ~68 KB olduğu
> için istemci bileşenlerine metinler prop olarak geçirilir.

**Yeni sayfa eklemek** için `src/lib/i18n.ts` içindeki rota tablosu tek değişiklik
noktasıdır: `PageKey` tipine anahtarı ekleyin, `pageSegments` içine iki dildeki URL
parçasını yazın (`tr: 'yeni-sayfa'`, `en: 'new-page'`). Site haritası, hreflang
bağlantıları, dil değiştirme düğmesi ve statik üretim listesi kendiliğinden güncellenir.
Hukuki/kurumsal dokümanlar için aynı dosyadaki `docKeys` + `docSegments` kullanılır ve
metin `site.json → content.<dil>.docs` altına eklenir.

---

## Fotoğraflar

Kaynak dosyalar `src/assets/photos/` altında durur. Tasarımdaki her `image-slot`
kimliği `src/lib/photos.ts` içinde gerçek dosyayla eşlenir (`SlotId` tipi). Kullanım:

```tsx
import { Photo, PhotoFrame } from '@/components/Photo';
<PhotoFrame ratio="4/3" slot="area-3" alt={area.title} sizes="(max-width: 768px) 100vw, 33vw" />
```

Bir fotoğrafı değiştirmek için dosyayı `src/assets/photos/` içine koyup `photos.ts`
tablosundaki ilgili satırı yeni dosyaya çevirmek yeterlidir; boyut, blur ön izleme ve
format dönüşümünü `next/image` üstlenir. Kırpma merkezi gereken yuvalar aynı dosyadaki
`objectPosition` tablosunda tutulur.

Site simgeleri (favicon, PWA, `logo.png`) `src/assets/logo-white.png` kaynağından
üretilir: `npm run images` → `public/`.

---

## Geliştirme

Node 20.9+ (önerilen: 22).

```bash
npm install          # bağımlılıklar
npm run dev          # http://localhost:3000 (geliştirme sunucusu)
npm run build        # üretim derlemesi (.next + .next/standalone)
npm start            # derlenmiş sürümü yerelde çalıştır
npm run images       # public/ altındaki simgeleri yeniden üret
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

`npm run build` sırasında **internet erişimi gerekir**: `next/font/google` yazı
tiplerini indirip çıktının içine gömer.

---

## Ortam değişkenleri

`.env.example` dosyasını `.env` olarak kopyalayıp doldurun.

| Değişken | Ne işe yarar |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Kanonik adres. `canonical`, `hreflang`, `og:url`, site haritası ve `robots.txt` bunu kullanır. **Derleme anında gömülür** — değiştirince yeniden derlemek gerekir. |
| `SMTP_HOST` | Form e-postalarının gönderileceği SMTP sunucusu. Boşsa site çalışır, gönderim yalnızca sunucu günlüğüne yazılır. |
| `SMTP_PORT` | SMTP portu (STARTTLS için 587, doğrudan TLS için 465). |
| `SMTP_SECURE` | 465 kullanılıyorsa `true`, 587 için `false`. |
| `SMTP_USER` | SMTP kullanıcı adı. |
| `SMTP_PASS` | SMTP parolası. Depoya girmez; sunucuda `.env` içinde durur. |
| `MAIL_FROM` | Gönderen adresi, örn. `"DroneTek Web <web@dronetek.com.tr>"`. |
| `MAIL_TO` | Form taleplerinin düşeceği kutu, örn. `iletisim@dronetek.com.tr`. |

`.env` dosyası `.gitignore` ve `.dockerignore` içindedir; imaja veya depoya girmez.

---

## VPS'e kurulum

Her iki yolda da uygulama **yalnızca 127.0.0.1:3000**'i dinler, 80/443'ü nginx karşılar.

### a) Docker ile (önerilen)

```bash
# 1) Kaynağı sunucuya alın
sudo mkdir -p /opt/dronetek && sudo chown $USER /opt/dronetek
git clone <depo-adresi> /opt/dronetek
cd /opt/dronetek/site

# 2) Ortam değişkenleri
cp .env.example .env && nano .env

# 3) İmajı derleyip başlatın (derleme birkaç dakika sürer, internet gerekir)
docker compose up -d --build
docker compose ps                 # durum: healthy
curl -I http://127.0.0.1:3000/tr  # 200 beklenir

# 4) nginx
sudo mkdir -p /var/www/certbot
sudo cp deploy/nginx.conf /etc/nginx/sites-available/dronetek.conf
sudo ln -s /etc/nginx/sites-available/dronetek.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
# Sertifika henüz yokken iki 443 bloğunu geçici olarak yorum satırı yapın:
sudo nginx -t && sudo systemctl reload nginx

# 5) TLS sertifikası (apex + www tek sertifikada)
sudo certbot certonly --webroot -w /var/www/certbot \
  -d dronetek.com.tr -d www.dronetek.com.tr
# 443 bloklarını geri açın:
sudo nginx -t && sudo systemctl reload nginx
```

Güncelleme:

```bash
cd /opt/dronetek && git pull
cd site && docker compose up -d --build && docker image prune -f
```

Günlükler: `docker compose logs -f web`

### b) Docker'sız (Node + systemd)

```bash
# 1) Node 22 ve nginx kurulu olmalı; servis kullanıcısı:
sudo adduser --system --group --home /var/www/dronetek dronetek

# 2) Kaynağı /var/www/dronetek içine alın (site klasörünün İÇERİĞİ bu yola gelmeli;
#    depo bir üst klasörse: git clone … /srv/dronetek && ln -s /srv/dronetek/site /var/www/dronetek)
sudo -u dronetek git clone <depo-adresi> /var/www/dronetek

# 3) Derleyin
cd /var/www/dronetek
sudo -u dronetek cp .env.example .env && sudo -u dronetek nano .env
sudo -u dronetek npm ci
sudo -u dronetek npm run build

# 4) standalone sunucusunun ihtiyaç duyduğu dosyaları yanına kopyalayın
sudo -u dronetek cp -r public .next/standalone/public
sudo -u dronetek cp -r .next/static .next/standalone/.next/static
sudo -u dronetek mkdir -p .next/standalone/.next/cache   # görsel önbelleği

# 5) Servis
sudo cp deploy/dronetek.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now dronetek
systemctl status dronetek

# 6) nginx + certbot: (a) yolundaki 4. ve 5. adımların aynısı
```

Güncelleme: `git pull` → 3. ve 4. adımları tekrarlayın → `sudo systemctl restart dronetek`.
Günlükler: `journalctl -u dronetek -f`

---

## Koda dokunmadan önce: iki tuzak

**1. 404 sınırı sunucu bileşeni olmalı.**
Kök yerleşim `app/[locale]/layout.tsx` altında olduğu için `not-found.tsx`
dosyalarının içinde istemci (`'use client'`) bileşenleri **sessizce çizilmiyor** —
Next kendi sade 404'üne düşüyor, hata da vermiyor. Bu yüzden
`app/[locale]/not-found.tsx` ve `app/[locale]/[...slug]/not-found.tsx` birer sunucu
bileşeni; dili `params` yerine proxy'nin eklediği `x-dronetek-locale` başlığından
okuyorlar (`LOCALE_HEADER`, `src/lib/i18n.ts`). Görünüm `NotFoundView` içinde ve
hiç React kancası kullanmıyor. Buraya kanca eklerseniz sayfa sessizce kaybolur.

**2. Hazır başlık ölçeğinin puntosunu ezmeye çalışmayın.**
Tailwind, aynı özelliğin iki keyfi değerini (`text-[20px]` ve `text-[21px]` gibi)
class attribute'undaki sıraya göre değil, ürettiği CSS'teki sıraya göre çözüyor.
Yani `cn(display.card, 'text-[20px]')` sessizce **çalışmayabilir**. Bu yüzden
`src/components/ui.tsx` içinde iki grup var: puntosuz yüzler (`face.*`) ve hazır
ölçekler (`display.*`). Tasarımdaki punto hazır ölçekten farklıysa `face.*` kullanıp
puntoyu kendiniz yazın.

## Bilinen sınır

`software` ve `contact-office` yuvalarının kaynak fotoğrafları
(`src/assets/photos/ist.jpeg`, `ist2.jpeg`) yalnızca **250×200 piksel** — diğer
fotoğraflar ~1300 piksel ve üzeri. `ist2.jpeg` ayrıca `mosaic-2` ve `mission-2`
yuvalarında da kullanılıyor. Bu görseller tasarımdaki kutuları doldurduğunda büyük
ekranlarda yumuşak/bulanık görünür. Aynı sahnenin
yüksek çözünürlüklü (en az ~1600 piksel genişlik) sürümü bulunup dosyaların üzerine
yazılmalı; `src/lib/photos.ts` içindeki eşleme aynı kaldığı sürece başka değişiklik
gerekmez.
