/**
 * Form gönderimlerinin e-postaya çıkışı (SMTP).
 *
 * Anahtarlar (.env) girilmeden de site çalışsın diye SMTP_HOST boşken hata
 * fırlatılmaz: içerik sunucu günlüğüne yazılır ve `delivered: false` dönülür.
 */
import { createTransport } from 'nodemailer';

type Mailer = ReturnType<typeof createTransport>;

export type MailInput = {
  subject: string;
  text: string;
  /** Yanıtla düğmesinin gideceği adres — formu dolduran kişi. */
  replyTo?: string;
};

/** Değerler istekte okunur; derleme sırasında ortam değişkenleri henüz yok. */
function config() {
  return {
    host: (process.env.SMTP_HOST ?? '').trim(),
    port: Number(process.env.SMTP_PORT ?? 587) || 587,
    secure: (process.env.SMTP_SECURE ?? '').trim().toLowerCase() === 'true',
    user: (process.env.SMTP_USER ?? '').trim(),
    pass: process.env.SMTP_PASS ?? '',
    from: (process.env.MAIL_FROM ?? '').trim() || 'DroneTek Web <web@dronetek.com.tr>',
    to: (process.env.MAIL_TO ?? '').trim() || 'iletisim@dronetek.com.tr',
  };
}

export function isMailConfigured(): boolean {
  return config().host !== '';
}

// Bağlantı havuzu istekler arasında paylaşılsın diye taşıyıcı bir kez kurulur.
let transporter: Mailer | null = null;

function getTransporter(): Mailer {
  if (transporter) return transporter;
  const { host, port, secure, user, pass } = config();
  transporter = createTransport({
    host,
    port,
    secure,
    auth: user ? { user, pass } : undefined,
  });
  return transporter;
}

/** Başlık enjeksiyonuna karşı: konu ve replyTo tek satır olmalı. */
function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

export async function sendMail({
  subject,
  text,
  replyTo,
}: MailInput): Promise<{ delivered: boolean }> {
  const { from, to } = config();
  const safeSubject = oneLine(subject);

  if (!isMailConfigured()) {
    console.info(
      `[mail] SMTP yapılandırılmamış, gönderilmedi.\nKonu: ${safeSubject}\nYanıt: ${
        replyTo ?? '-'
      }\n${text}`,
    );
    return { delivered: false };
  }

  await getTransporter().sendMail({
    from,
    to,
    subject: safeSubject,
    text,
    replyTo: replyTo ? oneLine(replyTo) : undefined,
  });
  return { delivered: true };
}
