import { prisma } from "@/lib/db";
import { saveReview, deleteReview } from "../actions";
import ConfirmSubmit from "../ConfirmSubmit";
import SaveButton from "../content/SaveButton";

export const dynamic = "force-dynamic";

const field =
  "w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none transition focus:border-brand-light";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-soft";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400">
      {"★".repeat(rating)}
      <span className="text-white/15">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default async function ReviewsAdminPage() {
  const reviews = await prisma.review.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
        Customer Reviews
      </h1>
      <p className="mt-2 text-sm text-brand-soft">
        These show in the “Reviews” section on the website. Lower sort order appears first.
      </p>

      {/* add new */}
      <form action={saveReview} className="mt-6 space-y-4 rounded-2xl border border-white/5 bg-ink-soft p-6">
        <h2 className="font-display text-sm font-bold uppercase tracking-widest text-brand-light">
          Add a review
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Customer name</label>
            <input name="name" required className={field} placeholder="e.g. Sara H." />
          </div>
          <div>
            <label className={labelCls}>Location / source (optional)</label>
            <input name="location" className={field} placeholder="e.g. Dubai · Google review" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Rating</label>
            <select name="rating" defaultValue="5" className={field}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} ★</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Sort order</label>
            <input name="sortOrder" type="number" defaultValue={0} className={field} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Review text</label>
          <textarea name="text" required rows={3} className={field} placeholder="What the customer said…" />
        </div>
        <label className="flex items-center gap-2 text-sm text-brand-soft">
          <input type="checkbox" name="published" defaultChecked className="h-4 w-4 accent-[#008067]" />
          Show on website
        </label>
        <SaveButton label="Add review" />
      </form>

      {/* existing */}
      <div className="mt-8 space-y-3">
        {reviews.map((r) => (
          <details key={r.id} className="rounded-2xl border border-white/5 bg-ink-soft p-5">
            <summary className="flex cursor-pointer items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-white">{r.name}</span>
                  <Stars rating={r.rating} />
                  {!r.published && (
                    <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-red-300">Hidden</span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-brand-soft">{r.text}</p>
              </div>
              <span className="shrink-0 text-xs text-brand-soft/50">edit ▾</span>
            </summary>

            <form action={saveReview} className="mt-4 space-y-4 border-t border-white/5 pt-4">
              <input type="hidden" name="id" value={r.id} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Customer name</label>
                  <input name="name" required defaultValue={r.name} className={field} />
                </div>
                <div>
                  <label className={labelCls}>Location / source</label>
                  <input name="location" defaultValue={r.location ?? ""} className={field} />
                </div>
                <div>
                  <label className={labelCls}>Rating</label>
                  <select name="rating" defaultValue={String(r.rating)} className={field}>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} ★</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Sort order</label>
                  <input name="sortOrder" type="number" defaultValue={r.sortOrder} className={field} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Review text</label>
                <textarea name="text" required defaultValue={r.text} rows={3} className={field} />
              </div>
              <label className="flex items-center gap-2 text-sm text-brand-soft">
                <input type="checkbox" name="published" defaultChecked={r.published} className="h-4 w-4 accent-[#008067]" />
                Show on website
              </label>
              <div className="flex gap-2">
                <SaveButton label="Save changes" />
              </div>
            </form>

            <form
              action={deleteReview}
              className="mt-2"
            >
              <input type="hidden" name="id" value={r.id} />
              <ConfirmSubmit
                message={`Delete the review from “${r.name}”?\n\nThis permanently removes it from the website. This cannot be undone.`}
                className="w-full rounded-lg border border-red-400/30 py-2 font-display text-xs font-bold uppercase tracking-wider text-red-300 transition hover:bg-red-500/20"
              >
                Delete review
              </ConfirmSubmit>
            </form>
          </details>
        ))}
        {reviews.length === 0 && (
          <p className="rounded-2xl border border-white/5 bg-ink-soft p-6 text-center text-sm text-brand-soft">
            No reviews yet — add your first one above.
          </p>
        )}
      </div>
    </div>
  );
}
