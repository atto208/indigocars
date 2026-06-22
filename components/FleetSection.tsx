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

  const categories = ORDER.filter(
    (c) => c === "All" || cars.some((car) => car.category === c)
  );
  for (const car of cars) {
    if (!categories.includes(car.category)) categories.push(car.category);
  }

  const visible = active === "All" ? cars : cars.filter((c) => c.category === active);

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

      <div className="mt-10 flex flex-wrap justify-center gap-2">
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
                <CarCard car={car} whatsappNumber={whatsappNumber} template={template} t={t} />
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
