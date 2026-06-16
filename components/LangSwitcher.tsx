"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALES, LOCALE_COOKIE, type Locale } from "@/lib/i18n";

export default function LangSwitcher({
  locale,
  solid,
}: {
  locale: Locale;
  solid: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function choose(code: string) {
    document.cookie = `${LOCALE_COOKIE}=${code};path=/;max-age=31536000;samesite=lax`;
    window.location.reload();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        data-cursor
        aria-label="Change language"
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider transition ${
          solid
            ? "border-brand/20 text-slate-brand/80 hover:border-brand/50 hover:text-brand"
            : "border-white/30 text-white hover:bg-white/10"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" strokeLinecap="round" />
        </svg>
        {current.code.toUpperCase()}
        <svg viewBox="0 0 24 24" className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-brand/10 bg-white py-1 shadow-xl" dir="ltr">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => choose(l.code)}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-brand-tint ${
                l.code === locale ? "font-bold text-brand" : "text-slate-brand/80"
              }`}
            >
              {l.name}
              {l.code === locale && (
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
