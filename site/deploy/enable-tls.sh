#!/usr/bin/env bash
# HavarTek — Let's Encrypt sertifikasını alır ve nginx'i TLS'li sürüme geçirir.
#
# Sunucuda root olarak çalıştırılır:
#   /var/www/havartek/deploy/enable-tls.sh
#
# Ön koşul: havartek.com ve www.havartek.com A kayıtları BU sunucuyu
# göstermeli. Betik önce bunu doğrular; DNS hazır değilse hiçbir şeye dokunmaz.
set -euo pipefail

DOMAIN="${DOMAIN:-havartek.com}"
EMAIL="${EMAIL:-}"
SITE_CONF=/etc/nginx/sites-available/havartek.conf
REPO_CONF=/var/www/havartek/deploy/nginx.conf

[ "$(id -u)" -eq 0 ] || { echo "root olarak çalıştırın" >&2; exit 1; }

echo "→ DNS denetimi"
myip=$(curl -fsS --max-time 10 https://api.ipify.org)
for host in "$DOMAIN" "www.$DOMAIN"; do
  got=$(dig +short "$host" A | tail -1)
  if [ "$got" != "$myip" ]; then
    echo "DURDU: $host -> ${got:-yanıt yok}, bu sunucu ise $myip." >&2
    echo "A kayıtlarını $myip adresine çevirip tekrar çalıştırın." >&2
    exit 1
  fi
  echo "  $host -> $got ✓"
done

echo "→ acme-challenge yolu erişilebilir mi"
mkdir -p /var/www/certbot/.well-known/acme-challenge
token="havartek-precheck-$$"
echo "$token" > "/var/www/certbot/.well-known/acme-challenge/$token"
got=$(curl -fsS --max-time 10 "http://$DOMAIN/.well-known/acme-challenge/$token" || true)
rm -f "/var/www/certbot/.well-known/acme-challenge/$token"
[ "$got" = "$token" ] || { echo "DURDU: acme-challenge dışarıdan okunamıyor." >&2; exit 1; }
echo "  ✓"

echo "→ sertifika"
# EMAIL verilirse süresi dolmadan uyarı postası gelir; verilmezse kayıtsız alınır.
if [ -n "$EMAIL" ]; then
  mail_args=(--email "$EMAIL")
else
  mail_args=(--register-unsafely-without-email)
fi
certbot certonly --webroot -w /var/www/certbot \
  --non-interactive --agree-tos "${mail_args[@]}" \
  -d "$DOMAIN" -d "www.$DOMAIN"

echo "→ nginx TLS'li sürüme geçiyor (eski yapılandırma .bak olarak saklanır)"
cp "$SITE_CONF" "$SITE_CONF.bak"
cp "$REPO_CONF" "$SITE_CONF"
if ! nginx -t; then
  echo "nginx testi başarısız; eski yapılandırma geri alınıyor." >&2
  cp "$SITE_CONF.bak" "$SITE_CONF"
  nginx -t && systemctl reload nginx
  exit 1
fi
systemctl reload nginx

echo "→ doğrulama"
curl -sS -o /dev/null -w "  https://$DOMAIN/tr      -> %{http_code} (http %{http_version})\n" "https://$DOMAIN/tr"
curl -sS -o /dev/null -w "  http://$DOMAIN/tr       -> %{http_code} -> %{redirect_url}\n" "http://$DOMAIN/tr"
curl -sS -o /dev/null -w "  https://www.$DOMAIN/tr  -> %{http_code} -> %{redirect_url}\n" "https://www.$DOMAIN/tr"
systemctl list-timers certbot.timer --no-pager | tail -2

echo "✓ TLS açık. Yenileme certbot.timer ile otomatik."
