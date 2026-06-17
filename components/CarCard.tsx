/* eslint-disable @next/next/no-img-element */
import { waLink } from "@/lib/settings";
import type { UI } from "@/lib/i18n";

export type CarData = {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  seats: number;
  horsepower: number;
  transmission: string;
  fuel: string;
  luggage: number;
  year: number | null;
  pricePerDay: string | null;
  featured: boolean;
  rented: boolean;
};

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-brand/75">
      <span className="text-brand-light">{icon}</span>
      {label}
    </div>
  );
}

const I = {
  seats: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="9" cy="7" r="3" /><path d="M4 21v-2a5 5 0 0 1 5-5h0a5 5 0 0 1 5 5v2" /><path d="M16 4a3 3 0 0 1 0 6M19 21v-2a5 5 0 0 0-3-4.6" />
    </svg>
  ),
  power: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  ),
  gear: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="5" cy="6" r="2" /><circle cx="12" cy="6" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="12" cy="18" r="2" /><path d="M5 8v8M12 8v8M19 8v4a2 2 0 0 1-2 2h-5" />
    </svg>
  ),
  fuel: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M2 21h14M14 10h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V9l-3-3" />
    </svg>
  ),
  luggage: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="5" y="7" width="14" height="13" rx="2" /><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </svg>
  ),
};

export default function CarCard({
  car,
  whatsappNumber,
  template,
  t,
  extra = "",
}: {
  car: CarData;
  whatsappNumber: string;
  template: string;
  t: UI;
  extra?: string;
}) {
  const message = template.replace("{car}", car.name) + extra;
  const href = waLink(whatsappNumber, message);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-brand/15">
      <div className="relative aspect-[8/5] overflow-hidden bg-gradient-to-b from-brand-tint to-white">
        <img
          src={car.image}
          alt={car.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.07]"
        />
        {/* sheen sweep */}
        <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/40 opacity-0 blur-md transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />
        <span className="absolute left-3 top-3 rounded-full bg-brand/95 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-white">
          {t.cat[car.category] ?? car.category}
        </span>
        {car.featured && !car.rented && (
          <span className="absolute right-3 top-3 rounded-full bg-accent/95 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-white">
            {t.popular}
          </span>
        )}
        {/* diagonal "RENTED" corner ribbon */}
        {car.rented && (
          <div className="pointer-events-none absolute -right-14 top-6 z-20 w-48 rotate-45 bg-red-600 py-1.5 text-center font-display text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg">
            {t.book.rented}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-bold text-brand">{car.name}</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-brand/55">
              {car.brand}
              {car.year ? ` · ${car.year}` : ""}
            </p>
          </div>
          {car.pricePerDay && (
            <div className="text-right">
              <div className="font-display text-lg font-bold text-accent">{car.pricePerDay}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-brand/55">{t.spec.perDay}</div>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-2.5 border-t border-brand/10 pt-4 sm:grid-cols-3">
          <Spec icon={I.seats} label={`${car.seats} ${t.spec.seats}`} />
          <Spec icon={I.power} label={`${car.horsepower} ${t.spec.hp}`} />
          <Spec icon={I.gear} label={t.trans[car.transmission] ?? car.transmission} />
          <Spec icon={I.fuel} label={t.fuel[car.fuel] ?? car.fuel} />
          <Spec icon={I.luggage} label={`${car.luggage} ${t.spec.bags}`} />
        </div>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor
          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-accent py-3 font-display text-sm font-bold uppercase tracking-widest text-white transition hover:bg-accent-light"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.7-1.3 1.3-1.8 1.4-.5 0-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c0 .2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.2 1.4 2.5 1.5.3.2.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.2.5.3.6.4 0 .1 0 .4-.2.8z" />
          </svg>
          {t.bookCta}
        </a>
      </div>
    </article>
  );
}
