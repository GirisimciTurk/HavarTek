import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Tek klasörde çalışabilen sunucu çıktısı — VPS/Docker dağıtımı için.
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Fotoğraf ağırlıklı site: modern formatlar ve tasarımdaki kırılma noktaları.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [420, 640, 828, 1080, 1320, 1920, 2560],
    imageSizes: [96, 160, 240, 320, 460],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
