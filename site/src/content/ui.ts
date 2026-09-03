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
  siteName: 'DroneTek',
  metaDescription:
    'DroneTek; paket, kargo ve insan taşımacılığı için drone tabanlı ulaşım sistemleri geliştiren mühendislik ve girişimcilik platformu.',
  titleSuffix: 'DroneTek',
  homeTitle: 'DroneTek — Drone tabanlı ulaşım sistemleri',
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
};

type UiStrings = typeof tr;

const en: UiStrings = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close',
  siteName: 'DroneTek',
  metaDescription:
    'DroneTek is an engineering and entrepreneurship platform developing drone-based transport systems for packages, cargo and people.',
  titleSuffix: 'DroneTek',
  homeTitle: 'DroneTek — Drone-based transport systems',
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
};

const strings: Record<Locale, UiStrings> = { tr, en };

export function getUi(locale: Locale): UiStrings {
  return strings[locale];
}
