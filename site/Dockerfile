# syntax=docker/dockerfile:1

# HavarTek kurumsal sitesi — çok aşamalı üretim imajı.
# Bağlam (build context) bu klasördür:  docker build -t havartek .

# ---------------------------------------------------------------------------
# 1) deps — bağımlılıklar
# ---------------------------------------------------------------------------
FROM node:22-alpine AS deps
# sharp ve Next'in yerel ikilileri Alpine'da glibc uyumluluk katmanı ister.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Yalnızca kilit dosyaları kopyalanır; kaynak değişse de bu katman önbellekte kalır.
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------
# 2) builder — derleme
# ---------------------------------------------------------------------------
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Kanonik adres derleme anında koda gömülür (canonical, hreflang, og:url,
# sitemap). Farklı bir alan adı için:
#   docker build --build-arg NEXT_PUBLIC_SITE_URL=https://ornek.com .
ARG NEXT_PUBLIC_SITE_URL=https://havartek.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# DİKKAT: next/font/google (Archivo + Instrument Sans) yazı tiplerini derleme
# sırasında indirip imaja gömer. Bu adımın internet erişimi olmalıdır; ağsız
# ortamda derleme "Failed to fetch font" ile durur.
RUN npm run build

# ---------------------------------------------------------------------------
# 3) runner — çalıştırma
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Konteyner dışından erişilebilmesi için tüm arayüzleri dinler; dışa açılan
# tek nokta yine de nginx olacak (bkz. docker-compose.yml port bağlaması).
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

# standalone çıktısı gereken node_modules'ı (sharp dahil) içinde taşır;
# runner aşamasında ayrıca kurulum gerekmez.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# next/image önbelleği çalışma anında buraya yazar.
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next

USER nextjs
EXPOSE 3000

# Ana sayfa (dil ön ekiyle) 200 dönüyorsa konteyner sağlıklı sayılır.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/tr').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
