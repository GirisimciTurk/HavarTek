/**
 * Form uçları için bellek içi hız sınırı.
 *
 * Site tek süreçli bir VPS'te (next start) çalıştığı için sayaçları bellekte
 * tutmak yeterli. Birden çok süreç/sunucuya dağıtılırsa bu sayaç süreç başına
 * ayrı çalışır; o durumda Redis gibi paylaşımlı bir depo gerekir.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Bellek sızmasın diye ara sıra süresi dolmuş kayıtları temizler. */
function prune(now: number): void {
  if (buckets.size < 512) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Anahtar başına pencere içinde en fazla `max` istek. `true` dönerse istek
 * kabul edilebilir, `false` dönerse sınır aşılmıştır (429).
 */
export function allowRequest(
  key: string,
  { max = 5, windowMs = 60_000 }: { max?: number; windowMs?: number } = {},
): boolean {
  const now = Date.now();
  prune(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= max) return false;
  bucket.count += 1;
  return true;
}

/**
 * İstemci IP'si. VPS'te Nginx arkasında çalıştığı için önce ters vekilin
 * eklediği başlıklara bakılır.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}
