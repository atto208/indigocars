"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import CarCard, { CarData } from "./CarCard";
import { Reveal, TiltCard } from "./interactions";
import type { UI } from "@/lib/i18n";

const ORDER = ["All", "Economy", "Comfort", "SUV", "Luxury", "Van"];

export default function FleetSection({
  cars,
  title,
  subtitle,
  whatsappNumber,
  template,
  t,
}: {
  cars: CarData[];
  title: string;
  subtitle: string;
  whatsappNumber: string;
  template: string;
  t: UI;
}) {
  const [active, setActive] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  const categories = ORDER.filter(
    (c) => c === "All" || cars.some((car) => car.category === c)
  );
  for (const car of cars) {
    if (!categories.includes(car.category)) categories.push(car.category);
  }

  const visible = active === "All" ? cars : cars.filter((c) => c.category === active);

  // Build the booking details appended to every car's WhatsApp message.
  const locLabel = (v: string) =>
    v === "ist" ? t.book.locIst : v === "saw" ? t.book.locSaw : v === "other" ? t.book.locOther : "";
  const parts: string[] = [];
  if (from || to) parts.push(`📅 ${t.book.msgDates}: ${from || "?"} → ${to || "?"}`);
  if (pickup) parts.push(`📍 ${t.book.msgPickup}: ${locLabel(pickup)}`);
  if (dropoff) parts.push(`📍 ${t.book.msgDropoff}: ${locLabel(dropoff)}`);
  const extra = parts.length ? `\n\n${parts.join("\n")}` : "";

  const today = new Date().toISOString().slice(0, 10);
  const fieldCls =
    "w-full rounded-xl border border-brand/15 bg-white px-3 py-2.5 text-sm text-brand outline-none transition focus:border-brand";
  const labelCls = "mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-brand/60";

  return (
    <section id="fleet" className="relative mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6">
      <Reveal className="text-center">
        <span className="font-display text-xs font-bold uppercase tracking-[0.3em] text-accent">
          {t.fleetEyebrow}
        </span>
        <h2 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight text-brand sm:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-brand/75">{subtitle}</p>
      </Reveal>

      {/* booking bar — choose dates + airports; flows into each WhatsApp message */}
      <Reveal className="mx-auto mt-10 max-w-4xl">
        <div className="rounded-2xl border border-brand/10 bg-brand-tint/50 p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
            <span className="font-display text-xs font-bold uppercase tracking-widest text-brand">{t.book.title}</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={labelCls}>{t.book.pickupDate}</label>
              <input type="date" min={today} value={from} onChange={(e) => setFrom(e.target.value)} data-cursor className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>{t.book.returnDate}</label>
              <input type="date" min={from || today} value={to} onChange={(e) => setTo(e.target.value)} data-cursor className={fieldCls} />
            </div>
            <div>
              <label className={labelCls}>{t.book.pickupLoc}</label>
              <select value={pickup} onChange={(e) => setPickup(e.target.value)} data-cursor className={fieldCls}>
                <option value="">{t.book.selectPlaceholder}</option>
                <option value="ist">{t.book.locIst}</option>
                <option value="saw">{t.book.locSaw}</option>
                <option value="other">{t.book.locOther}</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>{t.book.dropoffLoc}</label>
              <select value={dropoff} onChange={(e) => setDropoff(e.target.value)} data-cursor className={fieldCls}>
                <option value="">{t.book.selectPlaceholder}</option>
                <option value="ist">{t.book.locIst}</option>
                <option value="saw">{t.book.locSaw}</option>
                <option value="other">{t.book.locOther}</option>
              </select>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            data-cursor
            className={`relative rounded-full px-5 py-2 font-display text-xs font-bold uppercase tracking-widest transition ${
              active === c ? "text-white" : "text-slate-brand/70 hover:text-brand"
            }`}
          >
            {active === c && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 -z-10 rounded-full bg-brand shadow-md shadow-brand/25"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {active !== c && (
              <span className="absolute inset-0 -z-10 rounded-full border border-brand/15" />
            )}
            {t.cat[c] ?? c}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((car, i) => (
            <motion.div
              key={car.id}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.05, ease: [0.2, 0.7, 0.3, 1] as const }}
            >
              <TiltCard className="h-full">
                <CarCard car={car} whatsappNumber={whatsappNumber} template={template} t={t} extra={extra} />
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <p className="mt-10 text-center text-slate-brand/60">No cars in this category yet.</p>
      )}
    </section>
  );
}
