import { NextResponse } from 'next/server';

import { sendMail } from '@/lib/mailer';
import { allowRequest, clientIp } from '@/lib/rate-limit';

// nodemailer Node API'leri kullanıyor; Edge çalışma zamanında koşamaz.
export const runtime = 'nodejs';

const EMAIL_PATTERN = /^.+@.+\..+$/;
const FIELD_MAX = 2000;
const MESSAGE_MAX = 5000;
// Formdaki "en az birkaç cümle" kuralının sunucu tarafı karşılığı.
const MESSAGE_MIN = 20;

const invalid = () => NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });

function readField(value: unknown, max: number): string | null {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > max ? null : trimmed;
}

export async function POST(request: Request) {
  // Aynı IP: 60 saniyede en çok 5 istek.
  if (!allowRequest(`contact:${clientIp(request)}`)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return invalid();
  }
  if (typeof body !== 'object' || body === null) return invalid();

  const raw = body as Record<string, unknown>;

  // Bot tuzağı: gizli alan doluysa gönderme, ama bota başarı gibi görünsün.
  const honeypot = typeof raw.website === 'string' ? raw.website.trim() : '';
  if (honeypot) return NextResponse.json({ ok: true });

  const ad = readField(raw.ad, FIELD_MAX);
  const kurum = readField(raw.kurum, FIELD_MAX);
  const eposta = readField(raw.eposta, FIELD_MAX);
  const telefon = readField(raw.telefon, FIELD_MAX);
  const rol = readField(raw.rol, FIELD_MAX);
  const alan = readField(raw.alan, FIELD_MAX);
  const mesaj = readField(raw.mesaj, MESSAGE_MAX);

  if (
    ad === null ||
    kurum === null ||
    eposta === null ||
    telefon === null ||
    rol === null ||
    alan === null ||
    mesaj === null
  ) {
    return invalid();
  }
  if (!ad || mesaj.length < MESSAGE_MIN || !EMAIL_PATTERN.test(eposta)) return invalid();
  // KVKK onayı olmadan talep işlenmez; yalnızca gerçek `true` kabul edilir.
  if (raw.onay !== true) return invalid();

  const locale = raw.locale === 'en' ? 'en' : 'tr';
  const text = [
    'HavarTek.com web sitesi — yeni talep',
    '',
    `Ad soyad     : ${ad}`,
    `Kurum        : ${kurum || '-'}`,
    `E-posta      : ${eposta}`,
    `Telefon      : ${telefon || '-'}`,
    `Rol          : ${rol || '-'}`,
    `İlgili alan  : ${alan || '-'}`,
    'KVKK onayı   : evet',
    `Site dili    : ${locale}`,
    `Zaman        : ${new Date().toISOString()}`,
    '',
    'Talep:',
    mesaj,
  ].join('\n');

  try {
    await sendMail({ subject: `HavarTek talep — ${ad}`, text, replyTo: eposta });
  } catch (error) {
    // Teslimat başarısızsa talep kaybolmasın: içerik günlüğe düşsün.
    console.error('[contact] gönderilemedi', error, text);
    return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
