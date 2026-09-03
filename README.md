# DroneTek

DroneTek kurumsal sitesi — paket, kargo ve insan taşımacılığı için drone tabanlı
ulaşım sistemleri. DEV YAPIMCILIK YAYINCILIK SAN. TİC. LTD. ŞTİ. iştiraki.

## Depo düzeni

| Klasör | Ne var |
|---|---|
| **`site/`** | Yayınlanan site. Next.js 16 (App Router) + TypeScript + Tailwind 4. Kurulum, geliştirme ve VPS dağıtımı için **[`site/README.md`](site/README.md)** |
| `design-src/` | Kaynak tasarım (`DroneTek v4.dc.html` aktif sürüm) ve onu tarayıcıda açan betikler. Sitenin metinleri ve düzeni buradan çıkarıldı |

Sitedeki bütün Türkçe/İngilizce metinler `site/src/content/site.json` içinde ve
tasarım dosyasından programla çıkarıldı — elle yazılmadı. Fotoğrafların depodaki
tek kopyası `site/src/assets/photos`; tasarımdaki 50 görsel yuvasının hangi
fotoğrafa denk geldiği `site/src/lib/photos.ts` içinde.

## Hızlı başlangıç

```bash
cd site
npm ci
cp .env.example .env      # SMTP bilgileri (boş bırakılırsa form günlüğe yazar)
npm run dev               # http://localhost:3000
```

Üretim derlemesi ve sunucuya kurulum (Docker, nginx, systemd) için
[`site/README.md`](site/README.md).
