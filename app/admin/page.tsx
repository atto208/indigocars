import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

  const [carCount, fleetCount, activeBookings, upcomingBookings] = await Promise.all([
    prisma.car.count(),
    prisma.fleetCar.count(),
    prisma.booking.count({
      where: { startDate: { lte: todayUtc }, endDate: { gte: todayUtc } },
    }),
    prisma.booking.findMany({
      where: { endDate: { gte: todayUtc } },
      include: { fleetCar: true },
      orderBy: { startDate: "asc" },
      take: 8,
    }),
  ]);

  const stats = [
    { label: "Car models on website", value: carCount, href: "/admin/cars" },
    { label: "Cars in fleet", value: fleetCount, href: "/admin/calendar" },
    { label: "Rented out today", value: activeBookings, href: "/admin/calendar" },
  ];

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
        Dashboard
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-white/5 bg-ink-soft p-6 transition hover:border-brand-light/40"
          >
            <div className="font-display text-4xl font-bold text-accent-light">{s.value}</div>
            <div className="mt-2 text-sm text-brand-soft">{s.label}</div>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 font-display text-lg font-semibold uppercase tracking-wide text-white">
        Current & upcoming bookings
      </h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-soft font-display text-xs uppercase tracking-wider text-brand-soft">
            <tr>
              <th className="px-4 py-3">Car</th>
              <th className="px-4 py-3">Renter</th>
              <th className="px-4 py-3">Pickup</th>
              <th className="px-4 py-3">Return</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {upcomingBookings.map((b) => (
              <tr key={b.id} className="text-brand-soft">
                <td className="px-4 py-3 text-white">{b.fleetCar.name}</td>
                <td className="px-4 py-3">{b.firstName} {b.lastName}</td>
                <td className="px-4 py-3">{fmt(b.startDate)}</td>
                <td className="px-4 py-3">{fmt(b.endDate)}</td>
              </tr>
            ))}
            {upcomingBookings.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-brand-soft">
                  No upcoming bookings. Add one in the{" "}
                  <Link href="/admin/calendar" className="text-accent-light underline">calendar</Link>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
