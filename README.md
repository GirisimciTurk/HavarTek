# HavarTek

HavarTek.com kurumsal sitesi — paket, kargo ve insan taşımacılığı için drone tabanlı
ulaşım sistemleri. DEV YAPIMCILIK YAYINCILIK SAN. TİC. LTD. ŞTİ. iştiraki; yasal unvan
HavarTek İnsansız Hava Aracı Sistemleri A.Ş. Depo: `GirisimciTurk/HavarTek`, dal `main`.

## Depo düzeni

| Klasör | Ne var |
|---|---|
| **`site/`** | Yayınlanan site. Next.js 16 (App Router) + TypeScript + Tailwind 4, Poppins. Kurulum, geliştirme, VPS dağıtımı ve CI/CD için **[`site/README.md`](site/README.md)** |
| `design-src/` | Kaynak tasarım: **`HavarTek Aydınlık Tema.dc.html`** (aktif, açık tema, HavarTek.com markası) ve onu tarayıcıda açan betikler. `HavarTek v4.dc.html` ve öncekiler koyu temanın arşivi. Karar notları `design-src/aydinlik-tema-sync.md` |
| `.github/workflows/` | `ci.yml` — her PR'da lint + tip denetimi + derleme; `main`'e push'ta VPS'e dağıtım (`site/deploy/sync.sh` ile) |

Sitedeki bütün Türkçe/İngilizce metinler `site/src/content/site.json` içinde durur;
TR değerleri tasarımdan birebir alındı, EN karşılıkları aynı yapıda yazıldı.
Fotoğrafların depodaki tek kopyası `site/src/assets/photos`; tasarımdaki görsel
yuvalarının hangi fotoğrafa denk geldiği `site/src/lib/photos.ts` içinde. Logo
`site/src/assets/havartek-logo.webp` (açık zemin ister). İletişim bilgileri tek yerde:
`site/src/lib/site.ts → ORG` (0850 241 70 00 · WhatsApp 0544 694 32 78 ·
bedirkaraabali@girisimciturk.com · Gölbaşı / Ankara).

## Hızlı başlangıç

```bash
cd site
npm ci
cp .env.example .env      # SMTP bilgileri (boş bırakılırsa form günlüğe yazar)
npm run dev               # http://localhost:3000
```

Göndermeden önce CI'nın çalıştırdığı üçlü: `npm run lint && npm run typecheck && npm run build`.

## Yayın

`main`'e her push CI'dan geçer ve `site/deploy/sync.sh` ile sunucuya gider (rsync +
sunucuda derleme + `systemctl restart`); aynı betik yerelden de çalıştırılabilir.
Sunucudaki dizin/kullanıcı/servis adları (`/var/www/havartek`, `havartek`,
`havartek.service`) marka değişikliğinden sonra bilerek aynı bırakıldı. Secrets
kurulumu, sunucu bilgileri ve TLS/SMTP için kalan adımlar
[`site/README.md`](site/README.md) içinde.
