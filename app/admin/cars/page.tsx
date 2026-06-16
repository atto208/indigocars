/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteCar } from "../actions";
import ConfirmSubmit from "../ConfirmSubmit";

export const dynamic = "force-dynamic";

export default async function CarsAdminPage() {
  const cars = await prisma.car.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
            Cars on the Website
          </h1>
          <p className="mt-2 text-sm text-brand-soft">
            One card per model — duplicates in your fleet only appear once here.
          </p>
        </div>
        <Link
          href="/admin/cars/new"
          className="rounded-xl bg-accent px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-white transition hover:bg-accent-light"
        >
          + Add car
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cars.map((car) => (
          <div key={car.id} className="overflow-hidden rounded-2xl border border-white/5 bg-ink-soft">
            <div className="relative aspect-[8/5]">
              <img src={car.image} alt={car.name} className="h-full w-full object-cover" />
              {!car.published && (
                <span className="absolute left-3 top-3 rounded-full bg-red-500/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  Hidden
                </span>
              )}
              {car.featured && (
                <span className="absolute right-3 top-3 rounded-full bg-accent/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  Popular
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-semibold text-white">{car.name}</h3>
                  <p className="text-xs text-brand-soft">
                    {car.category} · {car.seats} seats · {car.horsepower} hp · {car.transmission} · {car.fuel}
                  </p>
                </div>
                {car.pricePerDay && (
                  <span className="font-display font-bold text-accent-light">{car.pricePerDay}</span>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/admin/cars/${car.id}`}
                  className="flex-1 rounded-lg bg-brand py-2 text-center font-display text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-light"
                >
                  Edit
                </Link>
                <form action={deleteCar} className="flex-1">
                  <input type="hidden" name="id" value={car.id} />
                  <ConfirmSubmit
                    message={`Delete “${car.name}” from the website?\n\nThis permanently removes the car and its details. This cannot be undone.`}
                    className="w-full rounded-lg border border-red-400/30 py-2 font-display text-xs font-bold uppercase tracking-wider text-red-300 transition hover:bg-red-500/20"
                  >
                    Delete
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
