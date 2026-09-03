'use client';

import { useId, useState } from 'react';

import { buttonStyles } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';

/** Tasarımdaki `t.form` alanları — sözlük istemci paketine girmesin diye elle yazıldı. */
export type RequestFormLabels = {
  ad: string;
  kurum: string;
  eposta: string;
  telefon: string;
  uni: string;
  rol: string;
  sektor: string;
  mesaj: string;
  send: string;
  pick: string;
  sentTitle: string;
  sent: string;
  again: string;
  err: string;
};

/** `getUi(locale).form` */
export type RequestFormUi = {
  sending: string;
  networkError: string;
  required: string;
  optional: string;
};

const EMAIL_PATTERN = /.+@.+\..+/;

const FIELD_CLASS =
  'rounded-[2px] border border-paper/22 bg-ink px-3.5 py-[13px] text-[16px] text-paper';
const LABEL_CLASS = 'text-[13px] tracking-[0.04em] text-paper/70';
const GROUP_CLASS = 'flex flex-col gap-2';

const EMPTY = {
  ad: '',
  kurum: '',
  eposta: '',
  telefon: '',
  uni: '',
  rol: '',
  sektor: '',
  mesaj: '',
};

type Values = typeof EMPTY;
type State = 'idle' | 'sending' | 'sent';

export function RequestForm({
  locale,
  labels,
  roles,
  sectors,
  ui,
}: {
  locale: Locale;
  labels: RequestFormLabels;
  roles: readonly string[];
  sectors: readonly string[];
  ui: RequestFormUi;
}) {
  const uid = useId();
  const errorId = `${uid}-error`;

  const [values, setValues] = useState<Values>(EMPTY);
  const [website, setWebsite] = useState(''); // bot tuzağı
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState('');

  function update(field: keyof Values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (error) setError('');
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'sending') return;

    // Tasarımdaki kural: ad, e-posta ve mesaj zorunlu.
    if (!values.ad.trim() || !EMAIL_PATTERN.test(values.eposta) || !values.mesaj.trim()) {
      setError(labels.err);
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
      setError(ui.networkError);
    }
  }

  if (state === 'sent') {
    return (
      <div role="status">
        <h2 className="rise m-0 font-display text-[26px] leading-[1.2] font-extrabold tracking-[-0.025em]">
          {labels.sentTitle}
        </h2>
        <p className="m-0 mt-3.5 text-[15px] leading-6 text-paper/74">{labels.sent}</p>
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY);
            setWebsite('');
            setError('');
            setState('idle');
          }}
          className={cn(buttonStyles.ghost, 'mt-6 px-6 py-[13px] text-[15px]')}
        >
          {labels.again}
        </button>
      </div>
    );
  }

  const sending = state === 'sending';

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-describedby={error ? errorId : undefined}
      className="flex flex-col gap-[18px]"
    >
      <div className={GROUP_CLASS}>
        <label htmlFor={`${uid}-ad`} className={LABEL_CLASS}>
          {labels.ad}
          <span className="sr-only"> ({ui.required})</span>
        </label>
        <input
          id={`${uid}-ad`}
          name="ad"
          type="text"
          autoComplete="name"
          required
          aria-required="true"
          value={values.ad}
          onChange={(event) => update('ad', event.target.value)}
          className={FIELD_CLASS}
        />
      </div>

      <div className={GROUP_CLASS}>
        <label htmlFor={`${uid}-kurum`} className={LABEL_CLASS}>
          {labels.kurum}
        </label>
        <input
          id={`${uid}-kurum`}
          name="kurum"
          type="text"
          autoComplete="organization"
          value={values.kurum}
          onChange={(event) => update('kurum', event.target.value)}
          className={FIELD_CLASS}
        />
      </div>

      <div className={GROUP_CLASS}>
        <label htmlFor={`${uid}-eposta`} className={LABEL_CLASS}>
          {labels.eposta}
          <span className="sr-only"> ({ui.required})</span>
        </label>
        <input
          id={`${uid}-eposta`}
          name="eposta"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          value={values.eposta}
          onChange={(event) => update('eposta', event.target.value)}
          className={FIELD_CLASS}
        />
      </div>

      <div className={GROUP_CLASS}>
        <label htmlFor={`${uid}-telefon`} className={LABEL_CLASS}>
          {labels.telefon}
        </label>
        <input
          id={`${uid}-telefon`}
          name="telefon"
          type="tel"
          autoComplete="tel"
          value={values.telefon}
          onChange={(event) => update('telefon', event.target.value)}
          className={FIELD_CLASS}
        />
      </div>

      <div className={GROUP_CLASS}>
        <label htmlFor={`${uid}-uni`} className={LABEL_CLASS}>
          {labels.uni}
        </label>
        <input
          id={`${uid}-uni`}
          name="uni"
          type="text"
          value={values.uni}
          onChange={(event) => update('uni', event.target.value)}
          className={FIELD_CLASS}
        />
      </div>

      <div className={GROUP_CLASS}>
        <label htmlFor={`${uid}-rol`} className={LABEL_CLASS}>
          {labels.rol}
        </label>
        <select
          id={`${uid}-rol`}
          name="rol"
          value={values.rol}
          onChange={(event) => update('rol', event.target.value)}
          className={FIELD_CLASS}
        >
          <option value="">{labels.pick}</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className={GROUP_CLASS}>
        <label htmlFor={`${uid}-sektor`} className={LABEL_CLASS}>
          {labels.sektor}
        </label>
        <select
          id={`${uid}-sektor`}
          name="sektor"
          value={values.sektor}
          onChange={(event) => update('sektor', event.target.value)}
          className={FIELD_CLASS}
        >
          <option value="">{labels.pick}</option>
          {sectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </div>

      <div className={GROUP_CLASS}>
        <label htmlFor={`${uid}-mesaj`} className={LABEL_CLASS}>
          {labels.mesaj}
          <span className="sr-only"> ({ui.required})</span>
        </label>
        <textarea
          id={`${uid}-mesaj`}
          name="mesaj"
          rows={4}
          required
          aria-required="true"
          value={values.mesaj}
          onChange={(event) => update('mesaj', event.target.value)}
          className={cn(FIELD_CLASS, 'resize-y')}
        />
      </div>

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
        <p id={errorId} role="alert" className="m-0 text-[14px] leading-[21px] text-amber-lift">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={sending}
        className={cn(buttonStyles.primary, 'px-[26px] py-[15px] text-[15px]')}
      >
        {sending ? ui.sending : labels.send}
      </button>
    </form>
  );
}
