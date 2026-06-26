import { prisma } from "@/lib/db";
import Calendar from "./Calendar";

export const dynamic = "force-dynamic";

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function CalendarPage() {
  const now = new Date();
  const todayUtc = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

  // visible window: 7 days back, 90 days ahead
  const windowStart = new Date(todayUtc);
  windowStart.setUTCDate(windowStart.getUTCDate() - 7);
  const windowEnd = new Date(todayUtc);
  windowEnd.setUTCDate(windowEnd.getUTCDate() + 90);

  const [fleetCars, bookings] = await Promise.all([
    prisma.fleetCar.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.booking.findMany({
      where: { endDate: { gte: windowStart }, startDate: { lte: windowEnd } },
      include: { fleetCar: { select: { name: true } } },
    }),
  ]);

  const days: string[] = [];
  for (let d = new Date(windowStart); d <= windowEnd; d.setUTCDate(d.getUTCDate() + 1)) {
    days.push(iso(d));
  }

  return (
    <Calendar
      cars={fleetCars.map((c) => ({ id: c.id, name: c.name }))}
      bookings={bookings.map((b) => ({
        id: b.id,
        fleetCarId: b.fleetCarId,
        carName: b.fleetCar.name,
        start: iso(b.startDate),
        end: iso(b.endDate),
        hold: b.hold,
        firstName: b.firstName,
        lastName: b.lastName,
        passportNumber: b.passportNumber ?? "",
        licenseNumber: b.licenseNumber ?? "",
        phone: b.phone ?? "",
        notes: b.notes ?? "",
      }))}
      days={days}
      today={iso(todayUtc)}
    />
  );
}
