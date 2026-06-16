import { Reveal } from "./interactions";
import type { UI } from "@/lib/i18n";

export type ReviewData = {
  id: string;
  name: string;
  location: string | null;
  rating: number;
  text: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${i <= rating ? "text-amber-400" : "text-brand/15"}`}
          fill="currentColor"
        >
          <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews({ reviews, t }: { reviews: ReviewData[]; t: UI }) {
  if (!reviews.length) return null;

  return (
    <section id="reviews" className="scroll-mt-20 bg-gradient-to-b from-white via-brand-tint/40 to-white">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal className="text-center">
          <span className="font-display text-xs font-bold uppercase tracking-[0.3em] text-accent">
            {t.reviews.eyebrow}
          </span>
          <h2 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight text-brand sm:text-5xl">
            {t.reviews.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-brand/75">{t.reviews.subtitle}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={(i % 3) * 0.08}>
              <figure className="flex h-full flex-col rounded-3xl border border-brand/10 bg-white p-7 shadow-sm transition hover:shadow-xl hover:shadow-brand/10">
                <Stars rating={r.rating} />
                <blockquote className="mt-4 flex-1 leading-relaxed text-slate-brand/85">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-brand/10 pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-display text-sm font-bold text-white">
                    {r.name.trim().charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <div className="font-display text-sm font-bold text-brand">{r.name}</div>
                    {r.location && (
                      <div className="text-xs text-slate-brand/55">{r.location}</div>
                    )}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
