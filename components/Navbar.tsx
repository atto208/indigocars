"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LangSwitcher from "./LangSwitcher";
import type { Locale, UI } from "@/lib/i18n";

export default function Navbar({
  whatsappHref,
  t,
  locale,
}: {
  whatsappHref: string;
  t: UI;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;
  const links = [
    { href: "#fleet", label: t.nav.ourCars },
    { href: "#why", label: t.nav.whyUs },
    { href: "#about", label: t.nav.about },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "border-b border-brand/10 bg-white/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center" data-cursor>
          <Image
            src={solid ? "/brand/logo-color.png" : "/brand/logo-white.png"}
            alt="Indigo Cars"
            width={150}
            height={34}
            priority
            className="h-8 w-auto"
          />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-cursor
              className={`font-display text-sm font-semibold uppercase tracking-widest transition ${
                solid ? "text-slate-brand/80 hover:text-brand" : "text-white/80 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
          <LangSwitcher locale={locale} solid={solid} />
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
            className="rounded-full bg-accent px-5 py-2 font-display text-sm font-bold uppercase tracking-wider text-white transition hover:bg-accent-light"
          >
            {t.nav.bookNow}
          </a>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LangSwitcher locale={locale} solid={solid} />
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <svg viewBox="0 0 24 24" className={`h-7 w-7 ${solid ? "text-brand" : "text-white"}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-brand/10 bg-white px-4 pb-5 pt-3 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 font-display text-sm font-semibold uppercase tracking-widest text-slate-brand"
            >
              {l.label}
            </a>
          ))}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block rounded-full bg-accent px-5 py-3 text-center font-display text-sm font-bold uppercase tracking-wider text-white"
          >
            {t.nav.bookNow}
          </a>
        </div>
      )}
    </header>
  );
}
