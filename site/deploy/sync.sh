#!/usr/bin/env bash
# HavarTek.com — yereldeki site/ klasörünü sunucuya gönderip yeniden derler.
#
# Sunucuda git klonu yok; kaynak rsync ile gidiyor. CI de main'e her push'ta
# aynı betiği çalıştırır (.github/workflows/ci.yml, HOST=vps takma adıyla).
# Kaynak olarak bu betiğin bir üst klasörü (site/) kullanılır.
#
#   ./deploy/sync.sh                 # varsayılan hedef: havartek-vps
#   HOST=root@1.2.3.4 ./deploy/sync.sh
#   REMOTE_DIR=/var/www/havartek     # varsayılan; gerekirse değiştirilir
#
# Hedef makinede beklenenler: node 22, /var/www/havartek dizini, havartek
# kullanıcısı ve havartek.service birimi (kurulum adımları README'de).
# Sunucudaki adlar (havartek: dizin, kullanıcı, servis) marka HavarTek.com'a
# geçtikten sonra da bilerek aynı bırakıldı — çalışan kurulum bozulmasın.
set -euo pipefail

HOST="${HOST:-havartek-vps}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/havartek}"
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "→ kaynak : $SRC"
echo "→ hedef  : $HOST:$REMOTE_DIR"

# .env sunucuda kalır; node_modules ve .next orada üretilir.
rsync -az --delete \
  --exclude 'node_modules/' \
  --exclude '.next/' \
  --exclude '.env' \
  --exclude 'next-env.d.ts' \
  "$SRC/" "$HOST:$REMOTE_DIR/"

ssh "$HOST" REMOTE_DIR="$REMOTE_DIR" 'bash -s' <<'REMOTE'
set -euo pipefail
cd "$REMOTE_DIR"
chown -R havartek:havartek "$REMOTE_DIR"
runuser -u havartek -- npm ci --no-audit --no-fund
runuser -u havartek -- env NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 npm run build

# standalone sunucusu public/ ve .next/static dosyalarını kendi yanında arar.
runuser -u havartek -- cp -r public .next/standalone/public
runuser -u havartek -- cp -r .next/static .next/standalone/.next/static
runuser -u havartek -- mkdir -p .next/standalone/.next/cache

systemctl restart havartek
sleep 4
systemctl is-active --quiet havartek || { journalctl -u havartek -n 30 --no-pager; exit 1; }
curl -fsS -o /dev/null -w 'yerel /tr -> %{http_code}\n' http://127.0.0.1:3000/tr
REMOTE

echo "✓ tamam"
