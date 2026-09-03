'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

import { cn } from '@/lib/cn';

const STORAGE_KEY = 'dronetek-cookie-consent';
/** Alt bilgideki "Çerez Tercihleri" düğmesi paneli bu olayla açar. */
const OPEN_PANEL_EVENT = 'dronetek:cookie-panel';
/** Tercih on iki ay saklanır (Çerez Politikası ile aynı süre). */
const CONSENT_TTL_MS = 365 * 24 * 60 * 60 * 1000;

type Consent = { analitik: boolean; pazarlama: boolean; ts: number };

/**
 * Onay kaydı tarayıcı deposunda yaşıyor; React'e efektle değil
 * `useSyncExternalStore` ile bağlanıyor. Böylece ilk boyamadan sonra fazladan
 * bir render zinciri kurulmuyor ve sunucu çıktısıyla uyum bozulmuyor.
 *
 * Üç durum var: `undefined` = henüz bilinmiyor (sunucu ve ilk boyama),
 * `null` = kayıt yok (bant gösterilir), nesne = kullanıcı karar vermiş.
 */
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedConsent: Consent | null = null;

function parseConsent(raw: string | null): Consent | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Consent>;
    if (typeof parsed.ts === 'number' && Date.now() - parsed.ts > CONSENT_TTL_MS) return null;
    return {
      analitik: Boolean(parsed.analitik),
      pazarlama: Boolean(parsed.pazarlama),
      ts: typeof parsed.ts === 'number' ? parsed.ts : Date.now(),
    };
  } catch {
    return null;
  }
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Depolama kapalıysa (gizli sekme, sıkı ayarlar) kayıt yok sayılır.
    return null;
  }
}

/** Aynı değer için aynı nesneyi döndürmeli; aksi halde sonsuz render olur. */
function getSnapshot(): Consent | null {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedConsent = parseConsent(raw);
  }
  return cachedConsent;
}

function getServerSnapshot(): Consent | null | undefined {
  return undefined;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Başka bir sekmede tercih değişirse burada da yansısın.
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function writeConsent(analitik: boolean, pazarlama: boolean) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ analitik, pazarlama, ts: Date.now() } satisfies Consent),
    );
  } catch {
    // Yazılamıyorsa sessizce geç; site çalışmaya devam eder.
  }
  listeners.forEach((notify) => notify());
}

/** Alt bilgiden paneli açan düğme. */
export function CookiePreferencesButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_PANEL_EVENT))}
      className="cursor-pointer rounded-full border border-paper/24 bg-transparent px-3.5 py-[7px] text-[13px] text-paper transition-colors hover:bg-paper/10"
    >
      {label}
    </button>
  );
}

export type CookieStrings = {
  barTitle: string;
  barBody: string;
  manage: string;
  reject: string;
  accept: string;
  panelTitle: string;
  save: string;
  close: string;
  locked: string;
  on: string;
  off: string;
  cats: ReadonlyArray<{ id: string; t: string; b: string }>;
  policyLabel: string;
  policyHref: string;
};

/** Metinler sunucu bileşeninden geçirilir; içerik sözlüğü istemci paketine girmesin. */
export function CookieConsent({ strings }: { strings: CookieStrings }) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [panelOpen, setPanelOpen] = useState(false);
  /** Kaydetmeden kapatıldığında bandı bu oturum boyunca gizler. */
  const [dismissed, setDismissed] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  /** Paneli açarken anahtarları kayıtlı tercihle eşitle. */
  const openPanel = useCallback(() => {
    const current = getSnapshot();
    setAnalytics(current?.analitik ?? false);
    setMarketing(current?.pazarlama ?? false);
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setDismissed(true);
  }, []);

  const write = useCallback((analitik: boolean, pazarlama: boolean) => {
    writeConsent(analitik, pazarlama);
    setAnalytics(analitik);
    setMarketing(pazarlama);
    setPanelOpen(false);
  }, []);

  useEffect(() => {
    const open = () => openPanel();
    window.addEventListener(OPEN_PANEL_EVENT, open);
    return () => window.removeEventListener(OPEN_PANEL_EVENT, open);
  }, [openPanel]);

  // Panel açıkken Esc ile kapat ve arka planın kaymasını engelle
  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [panelOpen, closePanel]);

  // `undefined` = henüz okunmadı; dönen ziyaretçide bant yanıp sönmesin.
  const barVisible = stored === null && !dismissed && !panelOpen;

  return (
    <>
      {barVisible ? (
        <div
          role="region"
          aria-label={strings.barTitle}
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-amber/40 bg-ink/96 backdrop-blur-[14px]"
        >
          <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-5">
            <div className="max-w-[62ch]">
              <span className="block font-display text-[17px] font-semibold leading-[22px] tracking-[-0.015em]">
                {strings.barTitle}
              </span>
              <p className="m-0 mt-2 text-[14px] leading-[21px] text-paper/72">{strings.barBody}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openPanel}
                className="cursor-pointer rounded-full border border-paper/28 bg-transparent px-[18px] py-[11px] text-[14px] text-paper transition-colors hover:bg-paper/10"
              >
                {strings.manage}
              </button>
              <button
                type="button"
                onClick={() => write(false, false)}
                className="cursor-pointer rounded-full border border-paper/28 bg-transparent px-[18px] py-[11px] text-[14px] text-paper transition-colors hover:bg-paper/10"
              >
                {strings.reject}
              </button>
              <button
                type="button"
                onClick={() => write(true, true)}
                className="cursor-pointer rounded-full border-0 bg-amber px-5 py-[11px] text-[14px] font-medium text-ink transition-colors hover:bg-amber-lift"
              >
                {strings.accept}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {panelOpen ? (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-ink/70 p-5 backdrop-blur-[6px]"
          onClick={(event) => {
            if (event.target === event.currentTarget) closePanel();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={strings.panelTitle}
            className="max-h-[86vh] w-full max-w-[560px] overflow-y-auto border border-paper/16 bg-surface p-[clamp(22px,3vw,32px)]"
          >
            <h2 className="m-0 font-display text-[24px] font-extrabold leading-[1.14] tracking-[-0.025em]">
              {strings.panelTitle}
            </h2>

            <div className="mt-5 flex flex-col">
              {strings.cats.map((category) => {
                const locked = category.id === 'zorunlu';
                const on =
                  category.id === 'analitik'
                    ? analytics
                    : category.id === 'pazarlama'
                      ? marketing
                      : true;
                const toggle = () => {
                  if (category.id === 'analitik') setAnalytics((value) => !value);
                  if (category.id === 'pazarlama') setMarketing((value) => !value);
                };
                return (
                  <div
                    key={category.id}
                    className="grid grid-cols-[1fr_auto] items-start gap-x-5 gap-y-3 border-t border-paper/14 py-[18px]"
                  >
                    <div>
                      <span className="block text-[16px] font-medium leading-[22px]">
                        {category.t}
                      </span>
                      <p className="m-0 mt-1.5 text-[14px] leading-[21px] text-paper/70">
                        {category.b}
                      </p>
                    </div>
                    {locked ? (
                      <span className="whitespace-nowrap text-[12px] uppercase tracking-[0.1em] text-paper/50">
                        {strings.locked}
                      </span>
                    ) : (
                      <label
                        className={cn(
                          'flex cursor-pointer items-center gap-[9px] whitespace-nowrap text-[13px]',
                          on ? 'text-amber' : 'text-paper/60',
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={toggle}
                          className="h-[18px] w-[18px] cursor-pointer accent-amber"
                        />
                        {on ? strings.on : strings.off}
                      </label>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => write(analytics, marketing)}
                className="cursor-pointer rounded-full border-0 bg-amber px-[22px] py-[13px] text-[15px] font-medium text-ink transition-colors hover:bg-amber-lift"
              >
                {strings.save}
              </button>
              <button
                type="button"
                onClick={() => write(true, true)}
                className="cursor-pointer rounded-full border border-paper/28 bg-transparent px-[22px] py-[13px] text-[15px] text-paper transition-colors hover:bg-paper/10"
              >
                {strings.accept}
              </button>
              <button
                type="button"
                onClick={closePanel}
                className="cursor-pointer border-0 bg-transparent px-2.5 py-[13px] text-[15px] text-paper/70 transition-colors hover:text-paper"
              >
                {strings.close}
              </button>
              <Link
                href={strings.policyHref}
                onClick={() => setPanelOpen(false)}
                className="self-center px-1 py-[13px] text-[14px] text-amber"
              >
                {strings.policyLabel}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
