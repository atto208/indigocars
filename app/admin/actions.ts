"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { ADMIN_COOKIE, isAdmin, makeSessionToken } from "@/lib/auth";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { LOCALIZED_KEYS, isLocale } from "@/lib/i18n";

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}

function revalidateAll() {
  revalidatePath("/", "layout");
}

// ---------- auth ----------

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  const password = formData.get("password") as string;
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Wrong password. Try again." };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, makeSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin");
}

// ---------- site content ----------

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const rawLocale = formData.get("locale");
  const locale = isLocale(rawLocale) ? rawLocale : "en";

  // English saves plain keys (everything). Other languages save only the
  // translatable text fields, namespaced as "<locale>:<key>".
  const keys = locale === "en" ? Object.keys(DEFAULT_SETTINGS) : [...LOCALIZED_KEYS];

  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value !== "string") continue;
    const storeKey = locale === "en" ? key : `${locale}:${key}`;
    await prisma.setting.upsert({
      where: { key: storeKey },
      update: { value },
      create: { key: storeKey, value },
    });
  }
  revalidateAll();
}

// ---------- cars ----------

export async function saveCar(formData: FormData) {
  await requireAdmin();
  const id = (formData.get("id") as string) || null;
  const data = {
    name: (formData.get("name") as string).trim(),
    brand: (formData.get("brand") as string).trim(),
    category: (formData.get("category") as string).trim(),
    image: (formData.get("image") as string).trim() || "/cars/fiat-egea.jpg",
    seats: parseInt(formData.get("seats") as string) || 5,
    horsepower: parseInt(formData.get("horsepower") as string) || 100,
    transmission: (formData.get("transmission") as string) || "Automatic",
    fuel: (formData.get("fuel") as string) || "Petrol",
    luggage: parseInt(formData.get("luggage") as string) || 3,
    year: parseInt(formData.get("year") as string) || null,
    pricePerDay: (formData.get("pricePerDay") as string).trim() || null,
    imaginMake: ((formData.get("imaginMake") as string) || "").trim().toLowerCase() || null,
    imaginModel: ((formData.get("imaginModel") as string) || "").trim().toLowerCase() || null,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };

  if (id) {
    await prisma.car.update({ where: { id }, data });
  } else {
    await prisma.car.create({ data });
  }
  revalidateAll();
  redirect("/admin/cars");
}

export async function deleteCar(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  await prisma.car.delete({ where: { id } });
  revalidateAll();
}

// ---------- reviews ----------

export async function saveReview(formData: FormData) {
  await requireAdmin();
  const id = (formData.get("id") as string) || null;
  const data = {
    name: (formData.get("name") as string).trim(),
    location: ((formData.get("location") as string) || "").trim() || null,
    rating: Math.min(5, Math.max(1, parseInt(formData.get("rating") as string) || 5)),
    text: (formData.get("text") as string).trim(),
    published: formData.get("published") === "on",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };
  if (id) {
    await prisma.review.update({ where: { id }, data });
  } else {
    await prisma.review.create({ data });
  }
  revalidateAll();
  redirect("/admin/reviews");
}

export async function deleteReview(formData: FormData) {
  await requireAdmin();
  await prisma.review.delete({ where: { id: formData.get("id") as string } });
  revalidateAll();
}

// ---------- fleet (calendar cars) ----------

export async function addFleetCar(formData: FormData) {
  await requireAdmin();
  const name = ((formData.get("name") as string) || "").trim();
  if (!name) return;
  const max = await prisma.fleetCar.aggregate({ _max: { sortOrder: true } });
  await prisma.fleetCar.create({
    data: { name, sortOrder: (max._max.sortOrder ?? 0) + 1 },
  });
  revalidatePath("/admin/calendar");
}

export async function renameFleetCar(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const name = ((formData.get("name") as string) || "").trim();
  if (!name) return;
  await prisma.fleetCar.update({ where: { id }, data: { name } });
  revalidatePath("/admin/calendar");
}

export async function deleteFleetCar(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  await prisma.fleetCar.delete({ where: { id } }); // bookings cascade
  revalidatePath("/admin/calendar");
}

// ---------- bookings ----------

function parseDay(value: string): Date {
  // "YYYY-MM-DD" → UTC midnight (date-only semantics)
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export type BookingResult = { error?: string; ok?: boolean };

export async function createBooking(
  _prev: BookingResult | undefined,
  formData: FormData
): Promise<BookingResult> {
  await requireAdmin();

  const fleetCarId = formData.get("fleetCarId") as string;
  const startDate = parseDay(formData.get("startDate") as string);
  const endDate = parseDay(formData.get("endDate") as string);

  if (!(startDate < endDate)) {
    return { error: "Return date must be after the pickup date." };
  }

  // Same-day turnover is allowed: a booking may start on the day another ends.
  // Conflict only when the ranges truly overlap (strict comparison).
  const conflict = await prisma.booking.findFirst({
    where: {
      fleetCarId,
      startDate: { lt: endDate },
      endDate: { gt: startDate },
    },
    include: { fleetCar: true },
  });
  if (conflict) {
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    return {
      error: `Not available: ${conflict.fleetCar.name} is already booked ${fmt(conflict.startDate)} → ${fmt(conflict.endDate)} (${conflict.firstName} ${conflict.lastName}). Same-day handover is allowed — a new rental can start on the return day.`,
    };
  }

  await prisma.booking.create({
    data: {
      fleetCarId,
      startDate,
      endDate,
      firstName: ((formData.get("firstName") as string) || "").trim(),
      lastName: ((formData.get("lastName") as string) || "").trim(),
      passportNumber: ((formData.get("passportNumber") as string) || "").trim() || null,
      licenseNumber: ((formData.get("licenseNumber") as string) || "").trim() || null,
      phone: ((formData.get("phone") as string) || "").trim() || null,
      notes: ((formData.get("notes") as string) || "").trim() || null,
    },
  });

  revalidatePath("/admin/calendar");
  return { ok: true };
}

export async function deleteBooking(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  await prisma.booking.delete({ where: { id } });
  revalidatePath("/admin/calendar");
}
