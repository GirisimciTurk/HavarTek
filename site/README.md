# HavarTek.com kurumsal sitesi

HavarTek.com'un iki dilli (TR/EN) kurumsal sitesi — paket, kargo ve insan taşımacılığı
için drone tabanlı ulaşım sistemleri. Kaynak tasarım, Claude Design canvas dosyası
**`design-src/HavarTek Aydınlık Tema.dc.html`** (eski `HavarTek v4.dc.html` koyu tema
arşivde); buradaki tüm ölçüler, renkler, boşluklar ve hover davranışları koda birebir
aktarıldı. Tasarım tek sayfa TR; site onu çok sayfalı TR/EN yapıya aynı görünümle
taşıyor. Sitedeki her metin `src/content/site.json` içinde durur — kodda elle yazılmış
Türkçe/İngilizce metin yoktur.

**Teknoloji yığını**

| Katman | Seçim |
| --- | --- |
| Çatı | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Stil | Tailwind CSS v4 (`@tailwindcss/postcss`), `src/app/globals.css` içinde tema |
| Yazı tipi | `next/font/google` — **Poppins** (başlık ve gövde, `--font-poppins`) |
| Görsel | `next/image` + `sharp` (AVIF/WebP, statik import, blur ön izleme) |
| 3B model | `three` (yalnızca 3B model sayfasında, istemci tarafında) |
| E-posta | `nodemailer` (iletişim ve bülten formu uçları) |
| Çıktı | `output: 'standalone'` — tek klasörde çalışan Node sunucusu |
| CI/CD | GitHub Actions (`.github/workflows/ci.yml`): lint + tip + derleme, main'de VPS'e dağıtım |

---

## Klasör düzeni

```
site/
├─ src/
│  ├─ app/                 Rotalar (App Router)
│  │  ├─ [locale]/layout.tsx     Kabuk: üst menü, alt bilgi, Poppins, meta
│  │  ├─ [locale]/page.tsx       Ana sayfa
│  │  ├─ [locale]/[...slug]/     Rota tablosundan çözülen alt sayfa ve dokümanlar
│  │  ├─ api/                    Form uçları (/api/contact, /api/newsletter)
│  │  └─ globals.css             Tailwind teması (token'lar) + `shell`, `section-y`, `kicker` …
│  ├─ components/          Arayüz: SiteHeader, SiteFooter, Photo, ui.tsx
│  │  ├─ home/             Ana sayfa bölümleri (HeroSection … StoriesAccordion)
│  │  ├─ contact/          RequestSection (07 · Talep) + RequestForm
│  │  └─ pages/            Sayfa gövdeleri (HomePage, AreasPage …)
│  ├─ content/             site.json (metinler) + index.ts + ui.ts
│  ├─ lib/                 i18n.ts, photos.ts, photo-alt.ts, site.ts, page-meta.ts, cn.ts
│  ├─ assets/              havartek-logo.webp + photos/ (kaynak fotoğraflar)
│  └─ proxy.ts             Dil ön eki yoksa /tr veya /en'e yönlendirir
├─ public/                 Üretilmiş simgeler, manifest (bkz. `npm run images`)
├─ scripts/build-images.mjs
├─ deploy/                 nginx.conf, havartek.service, sync.sh, enable-tls.sh
├─ Dockerfile · docker-compose.yml · .dockerignore
└─ .env.example
```

Depo kökündeki `.github/workflows/ci.yml` CI/CD akışıdır (aşağıda).

---

## Marka ve iletişim bilgileri

Tek yer: `src/lib/site.ts → ORG`. Bileşenler buradan okur, metne gömmez.

| | |
| --- | --- |
| Marka | HavarTek.com (`ORG.name`) — logo `src/assets/havartek-logo.webp`, 1280×1000, lacivert yazı + mavi drone işareti; **açık zemin ister** |
| Yasal unvan | `ORG.legalName` — dokümanlardaki unvan cümleleri buna bağlı |
| Çağrı merkezi | 0850 241 70 00 (`tel:+908502417000`) |
| WhatsApp | 0544 694 32 78 (`https://wa.me/905446943278`) |
| E-posta | bedirkaraabali@girisimciturk.com |
| Adres | Gölbaşı / Ankara |

Alan adı şimdilik `havartek.com` (`NEXT_PUBLIC_SITE_URL`). Başka bir alan adına
geçilirse `.env`, `deploy/nginx.conf` (`server_name`), `deploy/enable-tls.sh` (`DOMAIN`)
ve `ci.yml` içindeki `NEXT_PUBLIC_SITE_URL` birlikte değişir.

---

## Tasarım: açık tema

Renkler `src/app/globals.css` içinde `@theme` token'ları; Tailwind sınıfı olarak
(`bg-*`, `text-*`, `border-*`, `/xx` opaklık) kullanılır:

| Grup | Token'lar |
| --- | --- |
| Zemin | `ground` #F4F7FB (sayfa) · `navy` #08203F (koyu şerit, alt bilgi) · `tint` #E4EDF8 (hover, fotoğraf yer tutucu) · `field` #F8FAFD (form alanı) · `white` |
| Metin (açık zemin) | `ink` #0C1D38 · `muted` #46597A · `slate` #2C3F5C · `faint` #5B6E8C |
| Metin (koyu zemin) | `paper` #EAF2FD · `paper-soft` #DCE8F9 |
| Vurgu | `blue` #0F4CA8 · `blue-lift` #1763CE (hover) · `blue-soft` #7E9BC7 (gönderiliyor) · `sky` #9CC4FF · `sky-soft` #8CB8F2 |
| Kenarlık | `line` #D2DFEE · `line-soft` #DCE7F4 (kart) · `line-strong` #C9D9EC (form, filtre) · `line-chip` #B9CDE6 (iletişim hapları) |
| Hata | `error` #8C2230 · `error-bg` #FDECEC · `error-line` #F3C9C9 |
| Gölge | `shadow-float` (üst menü) · `shadow-card` · `shadow-panel` (form) · `shadow-open` (açık akordeon) |

`ink` artık **metin rengidir**, zemin değil; eski koyu temanın `amber`, `surface`,
`bg-ink` token'ları yok. Yardımcı sınıflar: `shell` (1320px + yatay padding),
`section-y`, `section-y-sm`, `kicker` (mavi 12px/0.16em), `kicker-sm`, `tnum`, `field`,
`rise`, `fade-in`. Yüz/ölçek/düğme kalıpları `src/components/ui.tsx` içinde
(`face`, `display`, `buttonStyles`, `chipClass`, `cardClass`, `Kicker`, `SectionHeading`).

**Üst menü yüzer ve akışta 0 yükseklik kaplar** (`position: sticky; top: 14px; height: 0`).
Bu yüzden her sayfanın **ilk bölümü** içeriğini menünün altından kurtaracak üst boşluğu
kendisi taşır: ana sayfa manşeti `pt-[clamp(96px,10vw,150px)]`, alt sayfa manşetleri en
az `pt-[clamp(120px,14vw,180px)]`. Yeni bir sayfa açarken bunu unutursanız başlık menünün
altında kalır.

**Ana sayfa bölümleri** (`src/components/pages/HomePage.tsx`, sırayla):

| # | Bölüm | Bileşen | Fotoğraf yuvası |
| --- | --- | --- | --- |
| — | Manşet | `HeroSection` | `hero` |
| 01 | Vaadimiz (koyu şerit, 4 madde) | `PromiseSection` | `promise-bg` |
| 02 | Platform (3 kart + mavi alt not) | `MissionSection` | `mission-0..2` |
| 03 | Kullanım alanları — 3 kategori (Lojistik · Şehir İçi Ulaşım · Acil Durum & Afet) + Tümü, 4 alan; `id="alanlar"` | `AreasSection` → `AreaCardGrid` | `area-0..3` |
| 04 | Süreç (4 adım) | `StepsSection` | `step-0..3` |
| — | Sahadan durumlar (akordeon; ilki açık başlar) | `StoriesSection` → `StoriesAccordion` | `stories` |
| 05 | Neden hava yolu | `WhyAirSection` | `why-air` |
| 06 | Gündem (3 kart, tarih yok) | `NewsSection` | — |
| 07 | Talep (form + iletişim hapları); `id="iletisim"` | `RequestSection` → `RequestForm` | `request-bg` |

`RequestSection` iletişim sayfasında da aynı bileşendir (`headingLevel="h1"`). Menü
bağlantıları sayfalara gider (Ana sayfa · Kullanım alanları · Teknoloji · İletişim;
"Talep oluştur" → iletişim); 3B model menüde yok, teknoloji sayfasındaki düğmeden açılır.

---

## İçerik nasıl güncellenir

**Tek doğruluk kaynağı: `src/content/site.json`.** İçinde `content.tr` ve `content.en`
aynı yapıyla durur; bir metni değiştirmek için iki dildeki karşılığını da düzenleyin.
Kod bu dosyaya yalnızca `getDictionary(locale)` ile erişir:

```ts
import { getDictionary } from '@/content';
const t = getDictionary(locale);   //  t.hero.l1, t.areas[0].title, t.stories[2].s …
```

Tasarımda karşılığı olmayan arayüz metinleri (mobil menü, form durumları, 404, 3B
model, SEO açıklamaları) `src/content/ui.ts` içindedir → `getUi(locale)`.

> `getDictionary` yalnızca sunucu bileşenlerinde kullanılır; `site.json` büyük olduğu
> için istemci (`'use client'`) bileşenlerine metinler **prop** olarak geçirilir.

**Yeni sayfa eklemek** için `src/lib/i18n.ts` içindeki rota tablosu tek değişiklik
noktasıdır: `PageKey` tipine anahtarı ekleyin, `pageSegments` içine iki dildeki URL
parçasını yazın (`tr: 'yeni-sayfa'`, `en: 'new-page'`). Site haritası, hreflang
bağlantıları, dil değiştirme düğmesi ve statik üretim listesi kendiliğinden güncellenir.
Hukuki/kurumsal dokümanlar için aynı dosyadaki `docKeys` + `docSegments` kullanılır ve
metin `site.json → content.<dil>.docs` altına eklenir. Alt bilgideki sıralama
`supportDocKeys` (Destek sütunu) ve `legalDocKeys` (telif satırı) dizilerinden gelir.

---

## Fotoğraflar

Kaynak dosyalar `src/assets/photos/` altında durur. Her yuva kimliği (`SlotId`)
`src/lib/photos.ts` içinde gerçek dosyayla eşlenir; tek başına duran fotoğrafların
alt metinleri `src/lib/photo-alt.ts` içindedir (`photoAlt(locale, slot)`). Kullanım:

```tsx
import { Photo, PhotoFrame } from '@/components/Photo';
<PhotoFrame ratio="4/3" slot="area-3" alt={area.title} sizes="(max-width: 768px) 100vw, 33vw" />
```

Yuvalar:

| Sayfa | `SlotId` |
| --- | --- |
| Ana sayfa | `hero`, `promise-bg`, `mission-0..2`, `area-0..3`, `step-0..3`, `stories`, `why-air`, `request-bg` |
| Kullanım alanları | `areas-hero`, `area-detail-0..3` |
| Teknoloji | `tech-hero`, `plat-0..2`, `payload-0..3`, `software` |
| 404 | `not-found` |

Eski temanın `mosaic-*`, `stats-bg`, `case`, `disaster`, `join`, `cta-bg`, `news-*`,
`contact-*`, `platform-shot`, `area-4..7` yuvaları **yok**; `coverPhoto` (sosyal paylaşım
kapağı) `photos.ts` içinde ayrıca dışa verilir. Fotoğraflar yalnızca `Photo`/`PhotoFrame`
+ `SlotId` ile kullanılır ve `sizes` zorunludur.

Bir fotoğrafı değiştirmek için dosyayı `src/assets/photos/` içine koyup `photos.ts`
tablosundaki ilgili satırı yeni dosyaya çevirmek yeterlidir; boyut, blur ön izleme ve
format dönüşümünü `next/image` üstlenir. Kırpma merkezi gereken yuvalar aynı dosyadaki
`objectPosition` tablosunda tutulur. **Yeni bir fotoğraf/logo dosyasını commit etmeyi
unutmayın**: CI depodaki dosyaları derler, yerelde duran ama izlenmeyen bir dosya CI
derlemesini düşürür.

Site simgeleri (favicon, PWA, `public/logo.png`, sosyal paylaşım kaynakları)
`npm run images` ile `scripts/build-images.mjs` tarafından `src/assets/havartek-logo.webp`
kaynağından üretilir; logo açık zemin istediği için simgeler beyaz kare üzerine
yerleştirilir. Logo değişirse betiği yeniden çalıştırıp `public/` çıktısını commit edin.

---

## Geliştirme

Node 20.9+ (önerilen: 22 — CI ve sunucu 22 kullanır).

```bash
npm ci               # bağımlılıklar (package-lock.json ile birebir)
npm run dev          # http://localhost:3000 (geliştirme sunucusu)
npm run build        # üretim derlemesi (.next + .next/standalone)
npm start            # derlenmiş sürümü yerelde çalıştır
npm run images       # public/ altındaki simgeleri yeniden üret
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

`npm run build` sırasında **internet erişimi gerekir**: `next/font/google` Poppins'i
indirip çıktının içine gömer. CI'da PR'lar `lint` → `typecheck` → `build` üçlüsünden
geçmeden birleştirilmemeli; aynı üçlüyü yerelde de çalıştırabilirsiniz.

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
| `MAIL_FROM` | Gönderen adresi, örn. `"HavarTek.com Web <web@havartek.com>"`. |
| `MAIL_TO` | Form taleplerinin düşeceği kutu: `bedirkaraabali@girisimciturk.com`. |

`.env` dosyası `.gitignore` ve `.dockerignore` içindedir; imaja veya depoya girmez.
`deploy/sync.sh` de sunucudaki `.env`'e dokunmaz.

---

## VPS'e kurulum

Her iki yolda da uygulama **yalnızca 127.0.0.1:3000**'i dinler, 80/443'ü nginx karşılar.
Yayındaki sunucu (b) yolunu kullanıyor; (a) Docker seçeneği alternatif olarak duruyor.

### a) Docker ile

```bash
# 1) Kaynağı sunucuya alın
sudo mkdir -p /opt/havartek && sudo chown $USER /opt/havartek
git clone https://github.com/GirisimciTurk/HavarTek.git /opt/havartek
cd /opt/havartek/site

# 2) Ortam değişkenleri
cp .env.example .env && nano .env

# 3) İmajı derleyip başlatın (derleme birkaç dakika sürer, internet gerekir)
docker compose up -d --build
docker compose ps                 # durum: healthy
curl -I http://127.0.0.1:3000/tr  # 200 beklenir

# 4) nginx
sudo mkdir -p /var/www/certbot
sudo cp deploy/nginx.conf /etc/nginx/sites-available/havartek.conf
sudo ln -s /etc/nginx/sites-available/havartek.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
# Sertifika henüz yokken iki 443 bloğunu geçici olarak yorum satırı yapın:
sudo nginx -t && sudo systemctl reload nginx

# 5) TLS sertifikası (apex + www tek sertifikada)
sudo certbot certonly --webroot -w /var/www/certbot \
  -d havartek.com -d www.havartek.com
# 443 bloklarını geri açın:
sudo nginx -t && sudo systemctl reload nginx
```

Güncelleme:

```bash
cd /opt/havartek && git pull
cd site && docker compose up -d --build && docker image prune -f
```

Günlükler: `docker compose logs -f web`

### b) Docker'sız (Node + systemd) — yayındaki yol

```bash
# 1) Node 22 ve nginx kurulu olmalı; servis kullanıcısı:
sudo adduser --system --group --home /var/www/havartek havartek

# 2) site/ klasörünün İÇERİĞİNİ /var/www/havartek içine alın. Yayındaki sunucuda
#    bu iş git ile değil, yerelden `deploy/sync.sh` ile (rsync) yapılıyor; git
#    tercih edilirse: git clone … /srv/havartek && ln -s /srv/havartek/site /var/www/havartek

# 3) Derleyin
cd /var/www/havartek
sudo -u havartek cp .env.example .env && sudo -u havartek nano .env
sudo -u havartek npm ci
sudo -u havartek npm run build

# 4) standalone sunucusunun ihtiyaç duyduğu dosyaları yanına kopyalayın
sudo -u havartek cp -r public .next/standalone/public
sudo -u havartek cp -r .next/static .next/standalone/.next/static
sudo -u havartek mkdir -p .next/standalone/.next/cache   # görsel önbelleği

# 5) Servis
sudo cp deploy/havartek.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now havartek
systemctl status havartek

# 6) nginx + certbot: (a) yolundaki 4. ve 5. adımların aynısı
```

Güncelleme: `./deploy/sync.sh` (3. ve 4. adımları + `systemctl restart havartek`'i
kendisi yapar). Günlükler: `journalctl -u havartek -f`

---

## Yayındaki kurulum (kvm1 — 179.198.201.109)

| | |
| --- | --- |
| Sunucu | Ubuntu 24.04.4 LTS · 1 vCPU · 3,8 GB RAM · 48 GB disk (`srv1952972`) |
| Yol | Yukarıdaki **(b) Node + systemd** — tek çekirdekte Docker derlemesi gereksiz yük |
| Uygulama | `/var/www/havartek`, `havartek` sistem kullanıcısı, `havartek.service` |
| Node | 22.x (NodeSource deposu; Ubuntu'nun kendi paketi çok eski) |
| nginx | `/etc/nginx/sites-available/havartek.conf` |
| Güvenlik duvarı | ufw: yalnızca OpenSSH + Nginx Full |
| SSH | `ssh havartek-vps` (takma ad: `root@179.198.201.109`, anahtar `~/.ssh/id_havartek`) |
| Güncelleme | main'e push → CI dağıtır; elle: `./deploy/sync.sh` (yerelden) |
| TLS'i açma | `deploy/enable-tls.sh` (sunucuda, DNS çevrildikten sonra) |

Sunucuda git klonu **yok**; kaynak rsync ile gidiyor ve güncelleme `deploy/sync.sh`
ile yapılıyor — **CI de aynı betiği kullanıyor**. Betik dosyaları gönderir, `npm ci &&
npm run build` çalıştırır, standalone dosyalarını yerine kopyalar ve servisi yeniden
başlatır. Tek çekirdekli makinede derlemenin belleğe takılmaması için 2 GB `/swapfile`
açıldı.

> **Sunucudaki adlar değişmedi.** Marka HavarTek.com'a geçti ama dizin
> (`/var/www/havartek`), sistem kullanıcısı (`havartek`), servis (`havartek.service`),
> nginx dosyası (`havartek.conf`) ve SSH takma adı (`havartek-vps`) bilerek aynı
> bırakıldı; çalışan kurulumu bozmamak için. Bunları yeniden adlandırmak isterseniz
> `deploy/*` dosyaları, `sync.sh` içindeki `REMOTE_DIR`/`chown`/`runuser`/`systemctl`
> satırları ve CI secrets'ı birlikte değişmeli.

### Kalan iki adım

**1. TLS — DNS bekliyor.** `havartek.com` A kaydı şu an **93.89.226.17**
adresini gösteriyor (bu sunucu değil), bu yüzden certbot doğrulaması geçmez.
Kayıt bu sunucuya çevrildikten sonra tek komut yeter:

```bash
ssh havartek-vps
EMAIL=bedirkaraabali@girisimciturk.com /var/www/havartek/deploy/enable-tls.sh
```

Betik önce A kayıtlarının gerçekten bu sunucuyu gösterdiğini ve
`/.well-known/acme-challenge/` yolunun dışarıdan okunabildiğini doğrular; ikisi
tamam değilse **hiçbir şeye dokunmadan durur**. Sonra sertifikayı alır, nginx'i
`deploy/nginx.conf` sürümüne geçirir (eskisini `.bak` olarak saklar), test
başarısızsa geri alır ve HTTPS'i doğrular. Yenileme `certbot.timer` ile otomatik.
TLS açıldıktan sonra 80 → 443 yönlendirmesi başlayacağı için CI'daki sağlık denetimi
adresini de değiştirin: `gh variable set HEALTH_URL --body https://havartek.com/tr`.

`deploy/nginx.conf` sunucuda kendinden imzalı sertifikayla önden denendi:
HTTP/2, `www` → apex ve 80 → 443 yönlendirmeleri ile HSTS başlığı çalışıyor.

**O zamana kadar geçici ön izleme adresi:**

> **https://179-198-201-109.sslip.io/tr** — geçerli Let's Encrypt sertifikası, HTTP/2.
> (`http://179.198.201.109/tr` de çalışır, ama tarayıcılar `https`'e zorlarsa hata verir.)

`sslip.io`, IP adresini kendi adında taşıyan bir DNS hizmetidir; bu ad doğrudan
179.198.201.109'a çözülür. Yapılandırması `/etc/nginx/sites-available/havartek-preview.conf`
içinde ayrı durur — asıl `havartek.conf`'a dokunmaz — ve arama motorlarına
girmemesi için `X-Robots-Tag: noindex, nofollow` gönderir.

Alan adı çalışmaya başlayınca ön izleme kaldırılır:

```bash
rm /etc/nginx/sites-enabled/havartek-preview.conf
certbot delete --cert-name 179-198-201-109.sslip.io
systemctl reload nginx
```

**2. SMTP — bilgi bekliyor.** `/var/www/havartek/.env` içindeki `SMTP_*` alanları
boş. Site çalışır, formlar başarı döndürür, ama e-posta gönderilmez; talebin
içeriği `journalctl -u havartek` günlüğüne yazılır. Bilgiler girildikten sonra
`systemctl restart havartek` yeterli — bu değerler derleme anında gömülmez.
`MAIL_TO` sunucuda `bedirkaraabali@girisimciturk.com` olmalı (bkz. `.env.example`).

---

## CI/CD (GitHub Actions)

Akış dosyası: `.github/workflows/ci.yml`. Depo: `GirisimciTurk/HavarTek`, varsayılan dal `main`.

| Tetikleyici | `check` (lint · tip · derleme) | `deploy` (VPS) |
| --- | --- | --- |
| `main`'e PR | ✓ | — |
| `main`'e push (birleştirme dahil) | ✓ | ✓ (`check` geçerse) |
| Elle (`workflow_dispatch`, Actions sekmesi ya da `gh workflow run ci.yml`) | ✓ | ✓ yalnızca `main` üzerinde |

`check`: `ubuntu-latest`, Node 22, npm önbelleği (`site/package-lock.json`),
`npm ci` → `npm run lint` → `npm run typecheck` → `npm run build`
(`NEXT_PUBLIC_SITE_URL=https://havartek.com`, `NEXT_TELEMETRY_DISABLED=1`).

`deploy`: `production` ortamında, aynı anda tek dağıtım (`concurrency: deploy-production`,
bekleyen iptal edilmez), 30 dakika zaman aşımı. Adımlar: secrets'tan SSH anahtarı ve
`~/.ssh/config` içine `Host vps` girdisi yazılır → `HOST=vps ./deploy/sync.sh`
(yerelde kullanılan betiğin aynısı: rsync + uzakta `npm ci && npm run build` +
standalone kopyaları + `systemctl restart havartek`) → `curl` ile sağlık denetimi
(`HEALTH_URL` değişkeni, yoksa `http://<VPS_HOST>/tr`; 200 beklenir).

Sunucuda derleme yapıldığı için CI'daki `build` adımı yalnızca **kapı** görevi görür;
sunucuya giden şey kaynak koddur, derleme çıktısı değil.

### Secrets

| Secret | Değer |
| --- | --- |
| `VPS_SSH_KEY` | CI'ya ait **parolasız** ed25519 özel anahtar (tam dosya içeriği) |
| `VPS_HOST` | `179.198.201.109` |
| `VPS_USER` | `root` |
| `VPS_KNOWN_HOSTS` | `ssh-keyscan 179.198.201.109` çıktısı (sunucu parmak izi; ilk bağlantı sorusunu ortadan kaldırır) |

İsteğe bağlı depo değişkeni (`gh variable set`): `HEALTH_URL` — sağlık denetimi adresi
(TLS açılınca `https://havartek.com/tr`).

Secrets depo düzeyinde tutulur; `production` ortamı ilk çalışmada GitHub tarafından
kendiliğinden oluşturulur. Dağıtım öncesi onay istenecekse Settings → Environments →
production altında "Required reviewers" açılır; akış dosyasında değişiklik gerekmez.

### İlk kurulum (bir kez)

Yerelden, sunucuya erişimi olan bir makinede:

```bash
# 1) CI için ayrı bir anahtar çifti (parolasız; kişisel anahtar CI'ya verilmez)
ssh-keygen -t ed25519 -f ~/.ssh/id_havartek_ci -N "" -C "havartek-ci"

# 2) Ortak anahtarı sunucuya ekleyin (root'un authorized_keys dosyasına)
ssh havartek-vps 'mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys' \
  < ~/.ssh/id_havartek_ci.pub
ssh -i ~/.ssh/id_havartek_ci -o IdentitiesOnly=yes root@179.198.201.109 'echo CI anahtarı çalışıyor'

# 3) Secrets (gh CLI ile depoya giriş yapılmış olmalı: gh auth status)
gh secret set VPS_SSH_KEY     --repo GirisimciTurk/HavarTek < ~/.ssh/id_havartek_ci
gh secret set VPS_HOST        --repo GirisimciTurk/HavarTek --body 179.198.201.109
gh secret set VPS_USER        --repo GirisimciTurk/HavarTek --body root
ssh-keyscan 179.198.201.109 2>/dev/null | gh secret set VPS_KNOWN_HOSTS --repo GirisimciTurk/HavarTek

# 4) Deneme: akışı elle tetikleyip izleyin
gh workflow run ci.yml --repo GirisimciTurk/HavarTek --ref main
gh run watch --repo GirisimciTurk/HavarTek
```

Anahtarı iptal etmek için sunucudaki `~/.ssh/authorized_keys` dosyasından
`havartek-ci` satırını silmek yeterlidir; secret'ı da `gh secret delete VPS_SSH_KEY` ile
kaldırın. Sunucu yeniden kurulursa (parmak izi değişirse) `VPS_KNOWN_HOSTS` yenilenir.

### Sık karşılaşılanlar

- **`check` geçiyor ama `deploy` "Permission denied (publickey)"**: ortak anahtar
  sunucuda değil ya da `VPS_SSH_KEY` eksik/yanlış yapıştırıldı (satır sonları dahil
  tam dosya olmalı).
- **"Host key verification failed"**: `VPS_KNOWN_HOSTS` boş ya da eski parmak izi.
- **Sağlık denetimi 301 döndü**: TLS açıldı, 80 artık yönlendiriyor → `HEALTH_URL`
  değişkenini ayarlayın.
- **CI'da derleme düşüyor, yerelde geçiyor**: commit edilmemiş bir fotoğraf/logo dosyası
  ya da `package-lock.json` ile uyuşmayan `node_modules` (`npm ci` kullanın).
- Uzaktaki derleme tek çekirdekte 3–6 dakika sürer; `deploy` günlüğünde `sync.sh`
  çıktısı olduğu gibi görünür (`yerel /tr -> 200` satırı sunucu içindeki denetimdir).

---

## Koda dokunmadan önce: üç tuzak

**1. 404 sınırı sunucu bileşeni olmalı.**
Kök yerleşim `app/[locale]/layout.tsx` altında olduğu için `not-found.tsx`
dosyalarının içinde istemci (`'use client'`) bileşenleri **sessizce çizilmiyor** —
Next kendi sade 404'üne düşüyor, hata da vermiyor. Bu yüzden
`app/[locale]/not-found.tsx` ve `app/[locale]/[...slug]/not-found.tsx` birer sunucu
bileşeni; dili `params` yerine proxy'nin eklediği `x-havartek-locale` başlığından
okuyorlar (`LOCALE_HEADER`, `src/lib/i18n.ts`). Görünüm `NotFoundView` içinde ve
hiç React kancası kullanmıyor. Buraya kanca eklerseniz sayfa sessizce kaybolur.

**2. Hazır başlık ölçeğinin puntosunu ezmeye çalışmayın.**
Tailwind, aynı özelliğin iki keyfi değerini (`text-[20px]` ve `text-[21px]` gibi)
class attribute'undaki sıraya göre değil, ürettiği CSS'teki sıraya göre çözüyor.
Yani `cn(display.card, 'text-[20px]')` sessizce **çalışmayabilir** (`cn` yalnızca
birleştirir, tailwind-merge yok). Bu yüzden `src/components/ui.tsx` içinde iki grup
var: puntosuz yüzler (`face.*`) ve hazır ölçekler (`display.*`). Tasarımdaki punto hazır
ölçekten farklıysa `face.*` kullanıp puntoyu kendiniz yazın.

**3. Üst menü akışta yer kaplamıyor.**
`SiteHeader` yüzen bir çubuk (`sticky`, `top: 14px`, **yükseklik 0**); altındaki
içeriği aşağı itmez. Her sayfanın ilk bölümü kendi üst boşluğunu taşır (yukarıda
"Tasarım: açık tema"). Yeni bir sayfa ya da manşet yazarken bu boşluğu vermezseniz
başlık menünün altında kalır — ve hiçbir hata almazsınız.

## Bilinen sınır

`software` yuvasının kaynak fotoğrafı (`src/assets/photos/ist.jpeg`) yalnızca
**250×200 piksel** — diğer fotoğraflar ~1300 piksel ve üzeri. Bu görsel teknoloji
sayfasındaki kutuyu doldurduğunda büyük ekranlarda yumuşak/bulanık görünür. Aynı
sahnenin yüksek çözünürlüklü (en az ~1600 piksel genişlik) sürümü bulunup dosyanın
üzerine yazılmalı; `src/lib/photos.ts` içindeki eşleme aynı kaldığı sürece başka
değişiklik gerekmez. Eski temada bu sorunu paylaşan `contact-office` ve `mosaic-2`
yuvaları artık yok; `ist2.jpeg` (yine 250×200) depoda duruyor ama hiçbir yuvaya bağlı
değil.
