"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Counter, Magnetic } from "./interactions";

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.7-1.3 1.3-1.8 1.4-.5 0-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c0 .2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.2 1.4 2.5 1.5.3.2.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.2.5.3.6.4 0 .1 0 .4-.2.8z" />
  </svg>
);

export default function Hero({
  badge,
  title,
  subtitle,
  cta,
  whatsappLabel,
  whatsappHref,
  stats,
  brands,
}: {
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  whatsappLabel: string;
  whatsappHref: string;
  stats: { value: string; label: string }[];
  brands: string[];
}) {
  const reduce = useReducedMotion();
  const words = title.replace(/\n/g, " ").split(" ");
  const marquee = [...brands, ...brands];

  // Browsers block autoplay unless the element is *actually* muted; React
  // doesn't always set the muted property, so force it + start playback.
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    v.addEventListener("loadeddata", tryPlay, { once: true });
    return () => v.removeEventListener("loadeddata", tryPlay);
  }, []);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  };
  const wordUp = {
    hidden: { y: "110%" },
    show: { y: "0%", transition: { duration: 0.8, ease: [0.2, 0.7, 0.3, 1] as const } },
  };

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden text-white">
      {/* cinematic video */}
      <div className="absolute inset-0 -z-10">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/hero-poster.jpg"
          src="/video/hero.mp4"
        />

        {/* brand gradient + legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/90 via-brand/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-brand-deep/30 to-brand-deep/20" />
        {/* grain */}
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pb-20">
        <motion.span
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-light opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-light" />
          </span>
          {badge}
        </motion.span>

        {/* kinetic headline */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-6 max-w-4xl font-display text-[3.4rem] font-extrabold uppercase leading-[0.92] tracking-tight sm:text-7xl xl:text-8xl"
        >
          {words.map((w, i) => (
            <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
              <motion.span variants={reduce ? undefined : wordUp} className="inline-block">
                {w}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-6 max-w-lg text-lg leading-relaxed text-white/85"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <a
              href="#fleet"
              data-cursor
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-8 py-4 font-display text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-accent/30"
            >
              <span className="absolute inset-0 bg-accent-light opacity-0 transition group-hover:opacity-100" />
              <span className="relative z-10">{cta}</span>
              <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
            </a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-[14px] font-display text-sm font-bold uppercase tracking-widest text-white backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-brand"
            >
              {WA_ICON}
              {whatsappLabel}
            </a>
          </Magnetic>
        </motion.div>

        {/* glass stats */}
        <motion.dl
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mt-12 inline-flex flex-wrap gap-x-10 gap-y-4 rounded-2xl border border-white/15 bg-white/10 px-7 py-5 backdrop-blur-md"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-3xl font-bold">
                <Counter value={s.value} />
              </dd>
              <dd className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-white/60">
                {s.label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* brand marquee */}
      <div className="relative z-10 border-t border-white/10 bg-brand-deep/30 py-4 backdrop-blur-sm">
        <div className="marquee-mask overflow-hidden">
          <div className="marquee-track gap-12 pr-12">
            {marquee.map((b, i) => (
              <span key={i} className="font-display text-base font-bold uppercase tracking-wider text-white/55">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <a
        href="#fleet"
        aria-label="Scroll to fleet"
        className="absolute bottom-24 right-6 hidden text-white/70 transition hover:text-white sm:block"
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 animate-bounce" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
