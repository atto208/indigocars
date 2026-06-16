import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { saveCar } from "../../actions";
import ImageUpload from "../../ImageUpload";
import SaveButton from "../../content/SaveButton";

export const dynamic = "force-dynamic";

function Input({
  name, label, defaultValue, type = "text", hint,
}: {
  name: string; label: string; defaultValue?: string | number | null; type?: string; hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-soft">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none transition focus:border-brand-light"
      />
      {hint && <p className="mt-1 text-xs text-brand-soft/60">{hint}</p>}
    </div>
  );
}

function Select({
  name, label, defaultValue, options,
}: {
  name: string; label: string; defaultValue?: string; options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-soft">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none transition focus:border-brand-light"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export default async function CarEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const car = isNew ? null : await prisma.car.findUnique({ where: { id } });
  if (!isNew && !car) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/cars" className="text-sm text-brand-soft hover:text-white">← Back to cars</Link>
      <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-white">
        {isNew ? "Add a Car" : `Edit ${car!.name}`}
      </h1>

      <form action={saveCar} className="mt-6 space-y-4 rounded-2xl border border-white/5 bg-ink-soft p-6">
        {!isNew && <input type="hidden" name="id" value={car!.id} />}

        <ImageUpload name="image" defaultValue={car?.image ?? ""} label="Car photo" />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="name" label="Model name (shown on card)" defaultValue={car?.name} />
          <Input name="brand" label="Brand" defaultValue={car?.brand} />
          <Select name="category" label="Category" defaultValue={car?.category ?? "Economy"} options={["Economy", "Comfort", "SUV", "Luxury", "Van"]} />
          <Input name="year" label="Year" type="number" defaultValue={car?.year} />
          <Input name="seats" label="Seats" type="number" defaultValue={car?.seats ?? 5} />
          <Input name="horsepower" label="Horsepower" type="number" defaultValue={car?.horsepower ?? 110} />
          <Select name="transmission" label="Transmission" defaultValue={car?.transmission ?? "Automatic"} options={["Automatic", "Manual"]} />
          <Select name="fuel" label="Fuel" defaultValue={car?.fuel ?? "Petrol"} options={["Petrol", "Diesel", "Hybrid", "Electric", "LPG"]} />
          <Input name="luggage" label="Luggage (bags)" type="number" defaultValue={car?.luggage ?? 3} />
          <Input name="pricePerDay" label="Price per day (optional)" defaultValue={car?.pricePerDay} hint="Free text, e.g. €35 or ₺1500. Leave empty to hide." />
          <Input name="sortOrder" label="Sort order" type="number" defaultValue={car?.sortOrder ?? 0} hint="Lower numbers appear first." />
        </div>

        <div className="rounded-xl border border-white/10 bg-ink p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-light">
            Studio image (imagin.studio)
          </p>
          <p className="mt-1 text-xs text-brand-soft/60">
            When an imagin.studio key is configured, the card shows an automatic studio
            side-profile built from these slugs (overrides the photo above). Leave blank to always use the photo.
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Input name="imaginMake" label="imagin make" defaultValue={car?.imaginMake} hint="e.g. bmw, mercedes, renault" />
            <Input name="imaginModel" label="imagin model family" defaultValue={car?.imaginModel} hint="e.g. 5-series, clio, tucson" />
          </div>
        </div>

        <div className="flex gap-8 pt-2">
          <label className="flex items-center gap-2 text-sm text-brand-soft">
            <input type="checkbox" name="featured" defaultChecked={car?.featured ?? false} className="h-4 w-4 accent-[#008067]" />
            Mark as “Popular”
          </label>
          <label className="flex items-center gap-2 text-sm text-brand-soft">
            <input type="checkbox" name="published" defaultChecked={car?.published ?? true} className="h-4 w-4 accent-[#008067]" />
            Visible on website
          </label>
        </div>

        <SaveButton label={isNew ? "Add car" : "Save changes"} />
      </form>
    </div>
  );
}
