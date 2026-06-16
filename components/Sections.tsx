/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { waLink } from "@/lib/settings";
import { Reveal, Counter, Magnetic } from "./interactions";
import type { UI } from "@/lib/i18n";

type S = Record<string, string>;

/* ---------------- Why Us — bento grid ---------------- */

const ICON = {
  delivery: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11M5 11h14M5 11a2 2 0 0 0-2 2v4h2m14-6a2 2 0 0 1 2 2v4h-2m-14 0v2h2v-2m10 0v2h2v-2m-12-2h12" /><circle cx="7.5" cy="17" r="1.5" fill="currentColor" /><circle cx="16.5" cy="17" r="1.5" fill="currentColor" /></svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" /></svg>
  ),
  plane: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 13.5L3 11l1-2 8 1 5-6a2 2 0 0 1 3 3l-6 5 1 8-2 1-2.5-7.5L7 18l-2 1v-3l3.5-2.5z" /></svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" /></svg>
  ),
  tag: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.6 13.4L13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 3 12V4a1 1 0 0 1 1-1h8a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>
  ),
};

export function WhyUs({ t, heroImage }: { t: UI; heroImage: string }) {
  const w = t.why;
  return (
    <section id="why" className="relative scroll-mt-20 bg-gradient-to-b from-white via-brand-tint/50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal className="text-center">
          <span className="font-display text-xs font-bold uppercase tracking-[0.3em] text-accent">{w.eyebrow}</span>
          <h2 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight text-brand sm:text-5xl">
            {w.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-brand/75">{w.subtitle}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {/* feature image tile */}
          <Reveal className="group relative overflow-hidden rounded-3xl sm:col-span-2 lg:row-span-2">
            <img src={heroImage} alt="Indigo Cars" className="h-full min-h-64 w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/90 via-brand/30 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-7">
              <div className="font-display text-2xl font-bold text-white">{w.deliveredTitle}</div>
              <p className="mt-1 max-w-xs text-sm text-white/80">{w.deliveredDesc}</p>
            </div>
          </Reveal>

          {/* tiles */}
          <Reveal delay={0.05} className="rounded-3xl bg-accent p-6 text-white">
            <span className="text-white/90">{ICON.shield}</span>
            <div className="mt-6 font-display text-xl font-bold">{w.insuredTitle}</div>
            <p className="mt-1 text-sm text-white/80">{w.insuredDesc}</p>
          </Reveal>

          <Reveal delay={0.1} className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm">
            <span className="text-brand">{ICON.chat}</span>
            <div className="mt-6 font-display text-xl font-bold text-brand">{w.supportTitle}</div>
            <p className="mt-1 text-sm text-slate-brand/70">{w.supportDesc}</p>
          </Reveal>

          <Reveal delay={0.05} className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-brand">{ICON.plane}</span>
              <span className="font-display text-3xl font-bold text-brand">
                <Counter value="2" /> {w.airportsWord}
              </span>
            </div>
            <div className="mt-6 font-display text-xl font-bold text-brand">{w.airportTitle}</div>
            <p className="mt-1 text-sm text-slate-brand/70">{w.airportDesc}</p>
          </Reveal>

          <Reveal delay={0.1} className="rounded-3xl bg-brand p-6 text-white">
            <span className="text-white/90">{ICON.spark}</span>
            <div className="mt-6 font-display text-xl font-bold">{w.newestTitle}</div>
            <p className="mt-1 text-sm text-white/80">{w.newestDesc}</p>
          </Reveal>

          <Reveal delay={0.15} className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm">
            <span className="text-accent">{ICON.tag}</span>
            <div className="mt-6 font-display text-xl font-bold text-brand">{w.pricingTitle}</div>
            <p className="mt-1 text-sm text-slate-brand/70">{w.pricingDesc}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- About ---------------- */

export function About({ s, t }: { s: S; t: UI }) {
  const paragraphs = s.aboutText.split("\n").filter(Boolean);
  const stats = [1, 2, 3, 4].map((i) => ({ value: s[`stat${i}Value`], label: s[`stat${i}Label`] }));

  return (
    <section id="about" className="scroll-mt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <span className="font-display text-xs font-bold uppercase tracking-[0.3em] text-accent">{t.aboutEyebrow}</span>
          <h2 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight text-brand sm:text-5xl">
            {s.aboutTitle}
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-slate-brand/85">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((st) => (
              <div key={st.label} className="rounded-2xl border border-brand/10 bg-white p-4 text-center shadow-sm">
                <div className="font-display text-2xl font-bold text-accent">
                  <Counter value={st.value} />
                </div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-brand/60">{st.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1} className="relative">
          <div className="absolute -bottom-4 -right-4 top-8 left-8 -z-10 rounded-3xl bg-brand/10" />
          <div className="overflow-hidden rounded-3xl border-4 border-white shadow-xl shadow-brand/15">
            <img src={s.aboutImage} alt={s.aboutTitle} className="h-full w-full object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */

export function Contact({ s, t }: { s: S; t: UI }) {
  const whatsappHref = waLink(s.whatsappNumber, s.whatsappGeneric);
  const items = [
    { label: t.contact.whatsappPhone, value: s.phone, href: whatsappHref },
    { label: t.contact.email, value: s.email, href: `mailto:${s.email}` },
    { label: t.contact.location, value: s.address },
    { label: t.contact.hours, value: s.workingHours },
  ];

  return (
    <section id="contact" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand to-brand-deep px-6 py-16 text-white sm:px-12">
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-brand-light/30 blur-3xl" />
          <Reveal className="relative text-center">
            <span className="font-display text-xs font-bold uppercase tracking-[0.3em] text-accent-light">{t.contact.eyebrow}</span>
            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
              {s.contactTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/75">{s.contactSubtitle}</p>
          </Reveal>

          <div className="relative mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            {items.map((it, i) => (
              <Reveal key={it.label} delay={i * 0.05}>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
                  <div className="font-display text-xs font-bold uppercase tracking-widest text-accent-light">{it.label}</div>
                  {it.href ? (
                    <a href={it.href} target="_blank" rel="noopener noreferrer" data-cursor className="mt-2 block text-lg font-semibold text-white transition hover:text-accent-light">
                      {it.value}
                    </a>
                  ) : (
                    <div className="mt-2 text-lg font-semibold text-white">{it.value}</div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <div className="relative mt-12 text-center">
            <Magnetic>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor
                className="inline-flex items-center gap-3 rounded-full bg-accent px-10 py-4 font-display text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-accent/30 transition hover:bg-accent-light"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.7-1.3 1.3-1.8 1.4-.5 0-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c0 .2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.2 1.4 2.5 1.5.3.2.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.2.5.3.6.4 0 .1 0 .4-.2.8z" />
                </svg>
                {t.contact.cta}
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

export function Footer({ s }: { s: S }) {
  return (
    <footer className="border-t border-brand/10 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-12 text-center sm:px-6">
        <Image src="/brand/logo-color.png" alt={s.siteName} width={160} height={36} className="h-8 w-auto" />
        <p className="max-w-xl text-sm text-slate-brand/70">{s.footerText}</p>
        <div className="flex items-center gap-6 text-sm">
          {s.instagram && (
            <a href={s.instagram} target="_blank" rel="noopener noreferrer" data-cursor className="text-brand transition hover:text-accent">
              Instagram
            </a>
          )}
          {s.website && <span className="text-slate-brand/60">{s.website}</span>}
        </div>
        <p className="text-xs text-slate-brand/45">
          © {new Date().getFullYear()} {s.siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export function WhatsAppFloat({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      data-cursor
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent shadow-lg shadow-accent/40 transition hover:scale-110 hover:bg-accent-light"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.7-1.3 1.3-1.8 1.4-.5 0-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c0 .2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.2 1.4 2.5 1.5.3.2.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.2.5.3.6.4 0 .1 0 .4-.2.8z" />
      </svg>
    </a>
  );
}
