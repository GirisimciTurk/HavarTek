#!/usr/bin/env bash
# HavarTek.com — yereldeki site/ klasörünü sunucuya gönderip yeniden derler ve
# kesintisiz yayına alır.
#
# Sunucuda git klonu yok; kaynak rsync ile gidiyor. CI de main'e her push'ta
# aynı betiği çalıştırır (.github/workflows/ci.yml, HOST=vps takma adıyla).
# Kaynak olarak bu betiğin bir üst klasörü (site/) kullanılır.
#
#   ./deploy/sync.sh                 # varsayılan hedef: havartek-vps
#   HOST=root@1.2.3.4 ./deploy/sync.sh
#   REMOTE_DIR=/var/www/havartek     # varsayılan; gerekirse değiştirilir
#
# Sunucudaki düzen (REMOTE_DIR = /var/www/havartek):
#   .env       çalışma anı ayarları (SMTP vb.) — rsync dokunmaz
#   app/       kaynak + node_modules + .next  — derleme burada yapılır
#   release/   yayındaki standalone sunucu     — havartek.service buradan çalışır
# Derleme yayındaki klasörde değil app/ içinde yapılır; bitince standalone
# çıktısı tek bir `mv` ile release/ olur ve servis yeniden başlar. Böylece
# derleme süresince (tek çekirdekte dakikalar) site kesintiye uğramaz.
#
# Hedef makinede beklenenler: node 22, havartek kullanıcısı, REMOTE_DIR/.env.
# Servis birimi (deploy/havartek.service) her dağıtımda sunucudakiyle
# karşılaştırılır; değişmişse kopyalanıp daemon-reload yapılır.
set -euo pipefail

HOST="${HOST:-havartek-vps}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/havartek}"
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "→ kaynak : $SRC"
echo "→ hedef  : $HOST:$REMOTE_DIR/app"

ssh "$HOST" "mkdir -p '$REMOTE_DIR/app'"

# .env sunucuda kalır; node_modules ve .next orada üretilir.
rsync -az --delete \
  --exclude 'node_modules/' \
  --exclude '.next/' \
  --exclude '.env' \
  --exclude 'next-env.d.ts' \
  "$SRC/" "$HOST:$REMOTE_DIR/app/"

ssh "$HOST" REMOTE_DIR="$REMOTE_DIR" 'bash -s' <<'REMOTE'
set -euo pipefail
APP="$REMOTE_DIR/app"
RELEASE="$REMOTE_DIR/release"
cd "$APP"
chown -R havartek:havartek "$REMOTE_DIR"
runuser -u havartek -- npm ci --no-audit --no-fund
runuser -u havartek -- env NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 npm run build

# standalone sunucusu public/ ve .next/static dosyalarını kendi yanında arar.
runuser -u havartek -- cp -r public .next/standalone/public
runuser -u havartek -- cp -r .next/static .next/standalone/.next/static
runuser -u havartek -- mkdir -p .next/standalone/.next/cache

# Servis birimi değiştiyse yenisini kur.
if ! cmp -s deploy/havartek.service /etc/systemd/system/havartek.service; then
  cp deploy/havartek.service /etc/systemd/system/havartek.service
  systemctl daemon-reload
  echo "→ havartek.service güncellendi"
fi

# Yayına alma: yeni çıktı release/ olur, eskisi ancak servis ayağa kalkınca silinir.
rm -rf "$RELEASE.new" "$RELEASE.old"
mv .next/standalone "$RELEASE.new"
[ -d "$RELEASE" ] && mv "$RELEASE" "$RELEASE.old"
mv "$RELEASE.new" "$RELEASE"
systemctl restart havartek
sleep 4
if ! systemctl is-active --quiet havartek; then
  journalctl -u havartek -n 30 --no-pager
  if [ -d "$RELEASE.old" ]; then
    echo "→ yeni sürüm ayağa kalkmadı, öncekine dönülüyor" >&2
    rm -rf "$RELEASE" && mv "$RELEASE.old" "$RELEASE" && systemctl restart havartek
  fi
  exit 1
fi
rm -rf "$RELEASE.old"

# Eski yerinde-derleme düzeninden (kaynak doğrudan REMOTE_DIR içindeyken) kalan
# dosyalar; yeni düzende hepsi app/ altında. Yalnızca release/ oluştuysa temizlenir.
if [ -d "$RELEASE" ]; then
  for leftover in .next node_modules src public scripts deploy package.json package-lock.json \
      tsconfig.json next.config.ts eslint.config.mjs postcss.config.mjs Dockerfile \
      docker-compose.yml .dockerignore README.md .gitignore .env.example next-env.d.ts; do
    rm -rf "${REMOTE_DIR:?}/$leftover"
  done
fi

curl -fsS -o /dev/null -w 'yerel /tr -> %{http_code}\n' http://127.0.0.1:3000/tr
REMOTE

echo "✓ tamam"
