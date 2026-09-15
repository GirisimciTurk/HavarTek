import { NextResponse } from 'next/server';

import { sendMail } from '@/lib/mailer';
import { allowRequest, clientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const EMAIL_PATTERN = /^.+@.+\..+$/;
const FIELD_MAX = 2000;

export async function POST(request: Request) {
  // İletişim formuyla aynı kural: aynı IP'den 60 saniyede en çok 5 istek.
  if (!allowRequest(`newsletter:${clientIp(request)}`)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }
  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;

  // Bot tuzağı: doluysa sessizce başarı dön.
  if (typeof raw.website === 'string' && raw.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof raw.email === 'string' ? raw.email.trim() : '';
  if (!email || email.length > FIELD_MAX || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }

  const locale = raw.locale === 'en' ? 'en' : 'tr';
  const text = [
    'HavarTek web sitesi — bülten kaydı',
    '',
    `E-posta   : ${email}`,
    `Site dili : ${locale}`,
    `Zaman     : ${new Date().toISOString()}`,
  ].join('\n');

  try {
    await sendMail({ subject: `HavarTek bülten kaydı (${locale}) — ${email}`, text, replyTo: email });
  } catch (error) {
    console.error('[newsletter] gönderilemedi', error, text);
    return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
