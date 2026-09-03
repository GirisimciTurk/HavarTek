'use client';

import { useId, useState } from 'react';

import type { Locale } from '@/lib/i18n';

const EMAIL_PATTERN = /.+@.+\..+/;

export type NewsletterStrings = {
  placeholder: string;
  submit: string;
  done: string;
  invalid: string;
  error: string;
  sending: string;
};

/** Metinler sunucu bileşeninden geçirilir; içerik sözlüğü istemci paketine girmesin. */
export function NewsletterForm({
  locale,
  strings,
}: {
  locale: Locale;
  strings: NewsletterStrings;
}) {
  const inputId = useId();

  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (state === 'done') {
    return (
      <p className="m-0 text-[15px] leading-6 text-amber" role="status">
        {strings.done}
      </p>
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setState('error');
      setMessage(strings.invalid);
      return;
    }

    setState('sending');
    setMessage('');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setState('done');
    } catch {
      setState('error');
      setMessage(strings.error);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="flex flex-wrap gap-2.5">
        <label htmlFor={inputId} className="sr-only">
          {strings.placeholder}
        </label>
        <input
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          placeholder={strings.placeholder}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (state === 'error') setState('idle');
          }}
          aria-invalid={state === 'error' || undefined}
          className="min-w-[220px] flex-1 rounded-[2px] border border-paper/22 bg-ink px-3.5 py-[13px] text-[15px] text-paper placeholder:text-paper/45"
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          className="cursor-pointer rounded-full border-0 bg-amber px-6 py-[13px] text-[15px] font-medium text-ink transition-colors hover:bg-amber-lift disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === 'sending' ? strings.sending : strings.submit}
        </button>
      </div>
      {message ? (
        <p className="m-0 mt-2.5 text-[14px] leading-[21px] text-amber-lift" role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}
