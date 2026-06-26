"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  addFleetCar,
  createBooking,
  confirmBooking,
  deleteBooking,
  deleteFleetCar,
  renameFleetCar,
  type BookingResult,
} from "../actions";

type CarRow = { id: string; name: string };
type BookingItem = {
  id: string;
  fleetCarId: string;
  carName: string;
  start: string;
  end: string;
  hold: boolean;
  firstName: string;
  lastName: string;
  passportNumber: string;
  licenseNumber: string;
  phone: string;
  notes: string;
};

const CELL = 44; // px per day
const ROW = 52; // px per car row
const BAR_COLORS = ["#008067", "#383e7e", "#1f6e9c", "#6b21a8", "#9a5b00"];

function addDays(isoDate: string, n: number): string {
  const d = new Date(isoDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function prettyDate(isoDate: string): string {
  return new Date(isoDate + "T00:00:00Z").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export default function Calendar({
  cars,
  bookings,
  days,
  today,
}: {
  cars: CarRow[];
  bookings: BookingItem[];
  days: string[];
  today: string;
}) {
  const [draft, setDraft] = useState<{ carId: string; start: string } | null>(null);
  const [detail, setDetail] = useState<BookingItem | null>(null);
  const [managing, setManaging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const dayIndex = new Map(days.map((d, i) => [d, i]));
  const todayIdx = dayIndex.get(today) ?? 0;

  // start scrolled so today is near the left edge
  useEffect(() => {
    scrollRef.current?.scrollTo({ left: Math.max(0, (todayIdx - 1) * CELL) });
  }, [todayIdx]);

  const colorFor = (id: string) => {
    let h = 0;
    for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return BAR_COLORS[h % BAR_COLORS.length];
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
            Booking Calendar
          </h1>
          <p className="mt-1 text-sm text-brand-soft">
            Click an empty day to create a booking · click a bar to see details.
            Same-day handover is supported — a new rental can start the day a car comes back.
          </p>
          <div className="mt-2 flex items-center gap-4 text-xs text-brand-soft">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-5 rounded bg-accent" /> Confirmed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-5 rounded border border-dashed border-accent-light bg-accent-light/15" /> Hold (tentative)
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setManaging(!managing)}
            className="rounded-xl border border-white/10 px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-brand-soft transition hover:border-brand-light/50 hover:text-white"
          >
            {managing ? "Done" : "Manage cars"}
          </button>
          <button
            onClick={() => setDraft({ carId: cars[0]?.id ?? "", start: today })}
            className="rounded-xl bg-accent px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-white transition hover:bg-accent-light"
          >
            + New booking
          </button>
        </div>
      </div>

      {/* add fleet car */}
      {managing && (
        <form
          action={addFleetCar}
          className="mt-4 flex max-w-md gap-2 rounded-xl border border-white/10 bg-ink-soft p-3"
        >
          <input
            name="name"
            required
            placeholder="Car name, e.g. Fiat Egea #5 — 34 ABC 123"
            className="flex-1 rounded-lg border border-white/10 bg-ink px-3 py-2 text-sm text-white outline-none focus:border-brand-light"
          />
          <button className="rounded-lg bg-brand px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-light">
            Add
          </button>
        </form>
      )}

      {/* timeline */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
        <div ref={scrollRef} className="overflow-x-auto">
          <div style={{ width: 224 + days.length * CELL }} className="relative">
            {/* header */}
            <div className="sticky top-0 z-20 flex border-b border-white/10 bg-ink-soft">
              <div className="sticky left-0 z-30 w-56 shrink-0 border-r border-white/10 bg-ink-soft px-4 py-2 font-display text-xs font-bold uppercase tracking-widest text-brand-soft">
                Car ({cars.length})
              </div>
              {days.map((d) => {
                const date = new Date(d + "T00:00:00Z");
                const isToday = d === today;
                const isWeekend = [0, 6].includes(date.getUTCDay());
                return (
                  <div
                    key={d}
                    style={{ width: CELL }}
                    className={`shrink-0 py-1.5 text-center ${isToday ? "bg-accent/30" : isWeekend ? "bg-white/[0.03]" : ""}`}
                  >
                    <div className="text-[9px] uppercase text-brand-soft/60">
                      {date.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" }).slice(0, 2)}
                    </div>
                    <div className={`font-display text-xs font-semibold ${isToday ? "text-accent-light" : "text-white"}`}>
                      {date.getUTCDate()}
                    </div>
                    <div className="text-[8px] uppercase text-brand-soft/50">
                      {date.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* rows */}
            {cars.map((car) => {
              const rowBookings = bookings.filter((b) => b.fleetCarId === car.id);
              return (
                <div key={car.id} className="relative flex border-b border-white/5" style={{ height: ROW }}>
                  <div className="sticky left-0 z-10 flex w-56 shrink-0 items-center justify-between gap-1 border-r border-white/10 bg-ink px-4">
                    {managing ? (
                      <>
                        <form action={renameFleetCar} className="flex flex-1 items-center gap-1">
                          <input type="hidden" name="id" value={car.id} />
                          <input
                            name="name"
                            defaultValue={car.name}
                            className="w-full rounded border border-white/10 bg-ink-soft px-2 py-1 text-xs text-white outline-none focus:border-brand-light"
                          />
                          <button title="Save name" className="text-xs text-accent-light hover:text-white">✓</button>
                        </form>
                        <form
                          action={deleteFleetCar}
                          onSubmit={(e) => {
                            if (!confirm(`Delete "${car.name}" and all its bookings?`)) e.preventDefault();
                          }}
                        >
                          <input type="hidden" name="id" value={car.id} />
                          <button title="Delete car" className="text-xs text-red-400 hover:text-red-300">✕</button>
                        </form>
                      </>
                    ) : (
                      <span className="truncate font-display text-sm text-white">{car.name}</span>
                    )}
                  </div>

                  {/* day cells */}
                  {days.map((d) => (
                    <button
                      key={d}
                      style={{ width: CELL }}
                      onClick={() => setDraft({ carId: car.id, start: d })}
                      className={`shrink-0 border-r border-white/[0.04] transition hover:bg-brand/30 ${
                        d === today ? "bg-accent/10" : ""
                      }`}
                      aria-label={`Book ${car.name} from ${d}`}
                    />
                  ))}

                  {/* booking bars: drawn from the middle of the pickup day to the
                      middle of the return day, so two bookings can share a day */}
                  {rowBookings.map((b) => {
                    const startIdx = dayIndex.get(b.start) ?? -0.5;
                    const endIdx = dayIndex.get(b.end) ?? days.length - 0.5;
                    const left = 224 + (startIdx + 0.5) * CELL;
                    const width = Math.max((endIdx - startIdx) * CELL, CELL * 0.6);
                    const color = colorFor(b.id);
                    const style: React.CSSProperties = b.hold
                      ? { left, width, top: 8, height: ROW - 16, background: `${color}26`, border: `1.5px dashed ${color}` }
                      : { left, width, top: 8, height: ROW - 16, background: color };
                    return (
                      <button
                        key={b.id}
                        onClick={() => setDetail(b)}
                        className="absolute z-[5] flex items-center gap-1 overflow-hidden rounded-lg px-2 text-left shadow-md transition hover:brightness-125"
                        style={style}
                        title={`${b.hold ? "HOLD · " : ""}${b.firstName} ${b.lastName} · ${b.start} → ${b.end}`}
                      >
                        {b.hold && (
                          <span className="shrink-0 rounded bg-white/20 px-1 text-[8px] font-bold uppercase tracking-wider text-white/90">
                            Hold
                          </span>
                        )}
                        <span className={`truncate text-xs font-semibold ${b.hold ? "text-white/90" : "text-white"}`}>
                          {b.firstName} {b.lastName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {cars.length === 0 && (
              <div className="p-10 text-center text-brand-soft">
                No cars yet — press “Manage cars” and add your first car.
              </div>
            )}
          </div>
        </div>
      </div>

      {draft && (
        <BookingModal
          cars={cars}
          initialCarId={draft.carId}
          initialStart={draft.start}
          onClose={() => setDraft(null)}
        />
      )}
      {detail && <DetailModal booking={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-ink-soft p-6 shadow-2xl">
        {children}
      </div>
    </div>
  );
}

function BookingModal({
  cars,
  initialCarId,
  initialStart,
  onClose,
}: {
  cars: CarRow[];
  initialCarId: string;
  initialStart: string;
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState<BookingResult | undefined, FormData>(
    createBooking,
    undefined
  );

  useEffect(() => {
    if (state?.ok) onClose();
  }, [state, onClose]);

  const field =
    "w-full rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-sm text-white outline-none transition focus:border-brand-light";
  const label = "mb-1 block text-xs font-bold uppercase tracking-wider text-brand-soft";

  return (
    <Overlay onClose={onClose}>
      <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
        New Booking
      </h2>
      <form action={action} className="mt-4 space-y-3">
        <div>
          <label className={label}>Car</label>
          <select name="fleetCarId" defaultValue={initialCarId} className={field}>
            {cars.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Pickup date</label>
            <input type="date" name="startDate" required defaultValue={initialStart} className={field} />
          </div>
          <div>
            <label className={label}>Return date</label>
            <input type="date" name="endDate" required defaultValue={addDays(initialStart, 3)} className={field} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>First name</label>
            <input name="firstName" required className={field} />
          </div>
          <div>
            <label className={label}>Last name</label>
            <input name="lastName" required className={field} />
          </div>
        </div>
        <div>
          <label className={label}>Passport number</label>
          <input name="passportNumber" className={field} />
        </div>
        <div>
          <label className={label}>Driving license number</label>
          <input name="licenseNumber" className={field} />
        </div>
        <div>
          <label className={label}>Phone (optional)</label>
          <input name="phone" className={field} />
        </div>
        <div>
          <label className={label}>Notes (optional)</label>
          <textarea name="notes" rows={2} className={field} placeholder="e.g. airport delivery, deposit paid…" />
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-ink p-3">
          <input type="checkbox" name="hold" className="mt-0.5 h-4 w-4 accent-[#00a583]" />
          <span className="text-sm text-brand-soft">
            <span className="font-semibold text-white">Hold (tentative)</span> — not a confirmed booking.
            Holds show as a light, dashed bar and don’t block other bookings. You can confirm it later.
          </span>
        </label>

        {state?.error && (
          <p className="rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">
            {state.error}
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 py-3 font-display text-xs font-bold uppercase tracking-widest text-brand-soft hover:text-white"
          >
            Cancel
          </button>
          <button
            disabled={pending}
            className="flex-1 rounded-xl bg-accent py-3 font-display text-xs font-bold uppercase tracking-widest text-white transition hover:bg-accent-light disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save booking"}
          </button>
        </div>
      </form>
    </Overlay>
  );
}

function DetailModal({ booking, onClose }: { booking: BookingItem; onClose: () => void }) {
  const [cstate, confirmAction, cpending] = useActionState<BookingResult | undefined, FormData>(
    confirmBooking,
    undefined
  );
  useEffect(() => {
    if (cstate?.ok) onClose();
  }, [cstate, onClose]);

  const rows = [
    ["Car", booking.carName],
    ["Pickup", prettyDate(booking.start)],
    ["Return", prettyDate(booking.end)],
    ["Renter", `${booking.firstName} ${booking.lastName}`],
    ["Passport no.", booking.passportNumber || "—"],
    ["License no.", booking.licenseNumber || "—"],
    ["Phone", booking.phone || "—"],
    ["Notes", booking.notes || "—"],
  ];

  return (
    <Overlay onClose={onClose}>
      <div className="flex items-center gap-3">
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
          Booking Details
        </h2>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${booking.hold ? "border border-dashed border-accent-light text-accent-light" : "bg-accent/25 text-accent-light"}`}>
          {booking.hold ? "Hold" : "Confirmed"}
        </span>
      </div>
      <dl className="mt-4 space-y-2.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 border-b border-white/5 pb-2">
            <dt className="text-xs font-bold uppercase tracking-wider text-brand-soft">{k}</dt>
            <dd className="text-right text-sm text-white">{v}</dd>
          </div>
        ))}
      </dl>

      {booking.hold && (
        <form action={confirmAction} className="mt-4">
          <input type="hidden" name="id" value={booking.id} />
          {cstate?.error && (
            <p className="mb-2 rounded-lg border border-red-400/30 bg-red-500/10 p-2.5 text-xs text-red-300">{cstate.error}</p>
          )}
          <button
            disabled={cpending}
            className="w-full rounded-xl bg-accent py-3 font-display text-xs font-bold uppercase tracking-widest text-white transition hover:bg-accent-light disabled:opacity-50"
          >
            {cpending ? "Confirming…" : "✓ Confirm this booking"}
          </button>
        </form>
      )}

      <div className="mt-3 flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 rounded-xl border border-white/10 py-3 font-display text-xs font-bold uppercase tracking-widest text-brand-soft hover:text-white"
        >
          Close
        </button>
        <form
          action={deleteBooking}
          className="flex-1"
          onSubmit={(e) => {
            const ok = window.confirm(
              `Delete the booking for ${booking.firstName} ${booking.lastName}?\n\nThis permanently removes this customer's rental record (${booking.carName}). This cannot be undone.`
            );
            if (!ok) e.preventDefault();
            else onClose();
          }}
        >
          <input type="hidden" name="id" value={booking.id} />
          <button className="w-full rounded-xl border border-red-400/30 py-3 font-display text-xs font-bold uppercase tracking-widest text-red-300 transition hover:bg-red-500/20">
            Delete booking
          </button>
        </form>
      </div>
    </Overlay>
  );
}
