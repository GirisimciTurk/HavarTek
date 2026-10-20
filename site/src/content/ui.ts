/**
 * Tasarımda karşılığı olmayan, gerçek sitenin ihtiyaç duyduğu arayüz metinleri
 * (mobil menü, 404 sayfası, form durumları, 3B model sayfası, SEO açıklamaları).
 * İçerik metinleri için `site.json` kullanılır.
 */
import type { Locale } from '@/lib/i18n';

const tr = {
  skipToContent: 'İçeriğe geç',
  menu: 'Menü',
  close: 'Kapat',
  siteName: 'GökTek',
  metaDescription:
    'GökTek; paket, kargo ve insan taşımacılığı için drone tabanlı ulaşım sistemleri geliştiren mühendislik ve girişimcilik platformu.',
  titleSuffix: 'GökTek',
  /**
   * Arama sonucu başlığı ve açıklaması. Sayfadaki h1 tasarımın sesini taşıyor;
   * bunlar aranan ifadeleri (drone ile kargo, İHA, VTOL…) öne alıyor. Başlık
   * "— GökTek" ekiyle 60, açıklama 160 karakteri geçmesin (Google keser).
   * Ana sayfa başlığı ek almaz, olduğu gibi kullanılır.
   */
  seo: {
    home: {
      title: 'GökTek — Drone ile kargo, paket ve acil teslimat',
      description:
        'Ankara merkezli drone taşımacılığı: kargo ve paket teslimi, şehir içi hava koridorları ve acil durum lojistiği. SHGM izinli, raporlu operasyon.',
    },
    areas: {
      title: 'Drone ile kargo, şehir içi ve acil taşıma',
      description:
        'Drone ile kargo ve paket teslimi, şehir içi taşıma koridorları, acil durum ve afet lojistiği. Her görevde teslim onayı, uçuş kaydı ve operasyon raporu.',
    },
    tech: {
      title: 'İHA platformları: VK-4, VK-7 ve VK-9 VTOL',
      description:
        'Çok rotorlu VK-4, sabit kanat VK-7 ve VTOL VK-9 karşılaştırması: havada kalış, menzil, faydalı yük. RGB, multispektral, termal ve LiDAR sensör yükleri.',
    },
    contact: {
      title: 'İletişim ve drone taşıma talebi',
      description:
        'Drone ile taşıma ihtiyacınızı, pilot uygulama önerinizi veya katılım başvurunuzu iletin. Talepler iki iş günü içinde değerlendirilir. Tel: 0850 241 70 00',
    },
    model3d: {
      title: 'VK-7 sabit kanat drone 3B model',
      description:
        'VK-7 sabit kanat insansız hava aracını tarayıcıda 3B inceleyin: 180 dakika havada kalış, 60 km telemetri menzili ve 2,5 kg faydalı yük.',
    },
  },
  notFound: {
    code: '404',
    title: 'Aradığınız sayfa bulunamadı',
    body: 'Adres değişmiş veya sayfa kaldırılmış olabilir. Aşağıdaki bağlantılardan devam edebilirsiniz.',
    home: 'Ana sayfaya dön',
    contact: 'İletişime geç',
  },
  form: {
    sending: 'Gönderiliyor…',
    networkError: 'Talep gönderilemedi. Lütfen biraz sonra tekrar deneyin.',
    required: 'zorunlu',
    optional: 'isteğe bağlı',
  },
  newsletter: {
    invalid: 'Geçerli bir e-posta adresi girin.',
    error: 'Kayıt tamamlanamadı. Lütfen tekrar deneyin.',
    sending: 'Kaydediliyor…',
  },
  model3d: {
    title: 'VK-7 · Sabit Kanat 3B Model',
    lead: 'Platformu döndürerek her açıdan inceleyin. Model tarayıcıda gerçek zamanlı çiziliyor.',
    hints: [
      'Döndürmek için sürükleyin',
      'Yakınlaşmak için tekerleği kullanın',
      'Kaydırmak için sağ tuşla sürükleyin',
    ],
    reset: 'Görünümü sıfırla',
    autorotate: 'Otomatik döndür',
    loading: '3B model yükleniyor…',
    unsupported:
      'Tarayıcınız WebGL desteklemediği için 3B model gösterilemiyor. Güncel bir tarayıcıda tekrar deneyin.',
    backToTech: 'Teknoloji sayfasına dön',
  },
  areasFilterLabel: 'Kullanım alanı kategorisi',
  platformFilterLabel: 'Uçuş platformu',
  breadcrumbHome: 'Ana Sayfa',
  areaServed: 'Türkiye',
  fest: {
    nav: 'Girişimci Fest',
    when: '7–13 Temmuz 2027 · Ankara',
    pitch: '31 ülkeden yatırımcıyla buluşun, ₺2.000.000 ödül için sahneye çıkın.',
    cta: 'Başvur',
  },
};

type UiStrings = typeof tr;

const en: UiStrings = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close',
  siteName: 'GökTek',
  metaDescription:
    'GökTek is an engineering and entrepreneurship platform developing drone-based transport systems for packages, cargo and people.',
  titleSuffix: 'GökTek',
  seo: {
    home: {
      title: 'GökTek — Drone delivery for cargo, parcels and emergencies',
      description:
        'Ankara-based drone transport: cargo and parcel delivery, urban air corridors and emergency logistics. Flown under SHGM permits, reported on every mission.',
    },
    areas: {
      title: 'Drone delivery: cargo, urban and emergency',
      description:
        'Drone cargo and parcel delivery, urban transport corridors, emergency and disaster logistics. Every mission ships with a delivery confirmation and flight log.',
    },
    tech: {
      title: 'UAV platforms: VK-4, VK-7 and VK-9 VTOL',
      description:
        'Multirotor VK-4, fixed-wing VK-7 and VTOL VK-9 compared on endurance, range and payload, plus RGB, multispectral, thermal and LiDAR sensor payloads.',
    },
    contact: {
      title: 'Contact and drone transport requests',
      description:
        'Send a drone transport need, a pilot project proposal or a request to join. Requests are reviewed within two business days. Phone: +90 850 241 70 00',
    },
    model3d: {
      title: 'VK-7 fixed-wing drone 3D model',
      description:
        'Inspect the VK-7 fixed-wing UAV in 3D in your browser: 180 minutes of endurance, 60 km telemetry range and a 2.5 kg payload.',
    },
  },
  notFound: {
    code: '404',
    title: 'We could not find that page',
    body: 'The address may have changed or the page may have been removed. Use the links below to continue.',
    home: 'Back to home',
    contact: 'Get in touch',
  },
  form: {
    sending: 'Sending…',
    networkError: 'The request could not be sent. Please try again shortly.',
    required: 'required',
    optional: 'optional',
  },
  newsletter: {
    invalid: 'Enter a valid email address.',
    error: 'Signup could not be completed. Please try again.',
    sending: 'Saving…',
  },
  model3d: {
    title: 'VK-7 · Fixed Wing 3D Model',
    lead: 'Rotate the platform to inspect it from every angle. The model is rendered live in your browser.',
    hints: ['Drag to rotate', 'Scroll to zoom', 'Right-click drag to pan'],
    reset: 'Reset view',
    autorotate: 'Auto-rotate',
    loading: 'Loading the 3D model…',
    unsupported:
      'Your browser does not support WebGL, so the 3D model cannot be shown. Please try a modern browser.',
    backToTech: 'Back to Technology',
  },
  areasFilterLabel: 'Application category',
  platformFilterLabel: 'Flight platform',
  breadcrumbHome: 'Home',
  areaServed: 'Turkey',
  fest: {
    nav: 'Girişimci Fest',
    when: '7–13 July 2027 · Ankara',
    pitch: 'Meet investors from 31 countries and pitch for a ₺2,000,000 prize.',
    cta: 'Apply',
  },
};

const strings: Record<Locale, UiStrings> = { tr, en };

export function getUi(locale: Locale): UiStrings {
  return strings[locale];
}
