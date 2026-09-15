'use client';

import { useId, useState, type ReactNode } from 'react';

import { buttonStyles } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';

/** Sözlükteki `t.form` alanları — site.json istemci paketine girmesin diye elle yazıldı. */
export type RequestFormLabels = {
  ad: string;
  kurum: string;
  eposta: string;
  telefon: string;
  rol: string;
  alan: string;
  mesaj: string;
  mesajPh: string;
  onay: string;
  pick: string;
  send: string;
  sending: string;
  note: string;
  sentTitle: string;
  sent: string;
  again: string;
  errName: string;
  errEmail: string;
  errMessage: string;
  errConsent: string;
  errNetwork: string;
};

/** `getUi(locale).form` */
export type RequestFormUi = {
  sending: string;
  networkError: string;
  required: string;
  optional: string;
};

// Tasarımdaki EMAIL_RE; mesaj için en az 20 karakter kuralı da oradan.
const EMAIL_PATTERN = /.+@.+\..+/;
const MESSAGE_MIN = 20;

const LABEL_CLASS = 'text-[13px] tracking-[0.03em] text-muted';
const GROUP_CLASS = 'flex min-w-0 flex-col gap-[7px]';

const EMPTY = {
  ad: '',
  kurum: '',
  eposta: '',
  telefon: '',
  rol: '',
  alan: '',
  mesaj: '',
  onay: false,
};

type Values = typeof EMPTY;
type State = 'idle' | 'sending' | 'sent';

/** Etiket + alan; zorunlularda görünür yıldız ve ekran okuyucu için "(zorunlu)". */
function Field({
  id,
  label,
  required,
  requiredText,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  requiredText: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn(GROUP_CLASS, className)}>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
        {required ? (
          <>
            <span aria-hidden="true"> *</span>
            <span className="sr-only"> ({requiredText})</span>
          </>
        ) : null}
      </label>
      {children}
    </div>
  );
}

/**
 * Talep formu — tasarım "HavarTek Aydınlık Tema.dc.html", 349–410. satırlar
 * ve script bloğundaki `submit` doğrulaması (sıra: ad → e-posta → mesaj → onay).
 */
export function RequestForm({
  locale,
  labels,
  roles,
  interests,
  ui,
}: {
  locale: Locale;
  labels: RequestFormLabels;
  roles: readonly string[];
  interests: readonly string[];
  ui: RequestFormUi;
}) {
  const uid = useId();
  const errorId = `${uid}-error`;

  const [values, setValues] = useState<Values>(EMPTY);
  const [website, setWebsite] = useState(''); // bot tuzağı
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState('');

  function update<K extends keyof Values>(field: K, value: Values[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    if (error) setError('');
  }

  function reset() {
    setValues(EMPTY);
    setWebsite('');
    setError('');
    setState('idle');
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'sending') return;

    let message = '';
    if (!values.ad.trim()) message = labels.errName;
    else if (!EMAIL_PATTERN.test(values.eposta.trim())) message = labels.errEmail;
    else if (values.mesaj.trim().length < MESSAGE_MIN) message = labels.errMessage;
    else if (!values.onay) message = labels.errConsent;
    if (message) {
      setError(message);
      return;
    }

    setState('sending');
    setError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, website, locale }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setState('sent');
    } catch {
      setState('idle');
      setError(labels.errNetwork);
    }
  }

  if (state === 'sent') {
    return (
      <div role="status">
        <h3 className="m-0 font-display text-[26px] leading-[1.2] font-extrabold tracking-[-0.015em]">
          {labels.sentTitle}
        </h3>
        <p className="m-0 mt-3.5 text-[15px] leading-6 text-muted">{labels.sent}</p>
        <button
          type="button"
          onClick={reset}
          className={cn(buttonStyles.ghost, 'mt-6 px-6 py-[13px] text-[15px]')}
        >
          {labels.again}
        </button>
      </div>
    );
  }

  const sending = state === 'sending';

  return (
    <form onSubmit={onSubmit} noValidate aria-describedby={error ? errorId : undefined}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-4">
        <Field id={`${uid}-ad`} label={labels.ad} required requiredText={ui.required}>
          <input
            id={`${uid}-ad`}
            name="ad"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            value={values.ad}
            onChange={(event) => update('ad', event.target.value)}
            className="field"
          />
        </Field>

        <Field id={`${uid}-kurum`} label={labels.kurum} requiredText={ui.required}>
          <input
            id={`${uid}-kurum`}
            name="kurum"
            type="text"
            autoComplete="organization"
            value={values.kurum}
            onChange={(event) => update('kurum', event.target.value)}
            className="field"
          />
        </Field>

        <Field id={`${uid}-eposta`} label={labels.eposta} required requiredText={ui.required}>
          <input
            id={`${uid}-eposta`}
            name="eposta"
            type="email"
            autoComplete="email"
            required
            aria-required="true"
            value={values.eposta}
            onChange={(event) => update('eposta', event.target.value)}
            className="field"
          />
        </Field>

        <Field id={`${uid}-telefon`} label={labels.telefon} requiredText={ui.required}>
          <input
            id={`${uid}-telefon`}
            name="telefon"
            type="tel"
            autoComplete="tel"
            value={values.telefon}
            onChange={(event) => update('telefon', event.target.value)}
            className="field"
          />
        </Field>

        <Field id={`${uid}-rol`} label={labels.rol} requiredText={ui.required}>
          <select
            id={`${uid}-rol`}
            name="rol"
            value={values.rol}
            onChange={(event) => update('rol', event.target.value)}
            className="field"
          >
            <option value="">{labels.pick}</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </Field>

        <Field id={`${uid}-alan`} label={labels.alan} requiredText={ui.required}>
          <select
            id={`${uid}-alan`}
            name="alan"
            value={values.alan}
            onChange={(event) => update('alan', event.target.value)}
            className="field"
          >
            <option value="">{labels.pick}</option>
            {interests.map((interest) => (
              <option key={interest} value={interest}>
                {interest}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        id={`${uid}-mesaj`}
        label={labels.mesaj}
        required
        requiredText={ui.required}
        className="mt-4"
      >
        <textarea
          id={`${uid}-mesaj`}
          name="mesaj"
          rows={5}
          required
          aria-required="true"
          placeholder={labels.mesajPh}
          value={values.mesaj}
          onChange={(event) => update('mesaj', event.target.value)}
          className="field resize-y leading-6"
        />
      </Field>

      <label className="mt-[18px] flex items-start gap-2.5 text-[14px] leading-[22px] text-muted">
        <input
          name="onay"
          type="checkbox"
          checked={values.onay}
          onChange={(event) => update('onay', event.target.checked)}
          className="mt-[3px] h-[17px] w-[17px] flex-none accent-blue"
        />
        <span>{labels.onay}</span>
      </label>

      {/* Bot tuzağı: gerçek kullanıcı göremez, doluysa sunucu sessizce yutar. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input
          id={`${uid}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="m-0 mt-4 rounded-[10px] border border-error-line bg-error-bg px-3.5 py-3 text-[14px] leading-[21px] text-error"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={sending}
        className={cn(
          'mt-[22px] w-full rounded-full border-0 px-[26px] py-[15px] text-[15px] font-medium text-white transition-colors duration-200',
          sending ? 'cursor-default bg-blue-soft' : 'cursor-pointer bg-blue',
        )}
      >
        {sending ? labels.sending : labels.send}
      </button>
      <p className="m-0 mt-3.5 text-[13px] leading-5 text-faint">{labels.note}</p>
    </form>
  );
}
