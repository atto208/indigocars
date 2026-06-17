"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { ADMIN_COOKIE, makeSessionToken, requireUser, requireAdmin } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { LOCALIZED_KEYS, isLocale } from "@/lib/i18n";

function revalidateAll() {
  revalidatePath("/", "layout");
}

// ---------- auth ----------

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  const username = ((formData.get("username") as string) || "").trim().toLowerCase();
  const password = (formData.get("password") as string) || "";
  if (!username || !password) return { error: "Enter your username and password." };

  let user = await prisma.user.findUnique({ where: { username } });

  // Bootstrap: on a fresh install with no users, the ADMIN_PASSWORD env lets you
  // create the first admin account by logging in with any username.
  if (!user && (await prisma.user.count()) === 0 && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
    user = await prisma.user.create({
      data: { username, name: "Admin", role: "admin", passwordHash: hashPassword(password) },
    });
  }

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Wrong username or password." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, makeSessionToken(user.id), {
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

// ---------- users (admin only) ----------

export async function createUser(_prev: { error?: string } | undefined, formData: FormData) {
  await requireAdmin();
  const username = ((formData.get("username") as string) || "").trim().toLowerCase();
  const name = ((formData.get("name") as string) || "").trim() || null;
  const password = (formData.get("password") as string) || "";
  const role = (formData.get("role") as string) === "admin" ? "admin" : "manager";

  if (!/^[a-z0-9._-]{3,}$/.test(username)) {
    return { error: "Username must be 3+ chars: letters, numbers, . _ - only." };
  }
  if (password.length < 6) return { error: "Password must be at least 6 characters." };
  if (await prisma.user.findUnique({ where: { username } })) {
    return { error: "That username is already taken." };
  }

  await prisma.user.create({ data: { username, name, role, passwordHash: hashPassword(password) } });
  redirect("/admin/users");
}

export async function updateUser(_prev: { error?: string } | undefined, formData: FormData) {
  const me = await requireAdmin();
  const id = formData.get("id") as string;
  const name = ((formData.get("name") as string) || "").trim() || null;
  const role = (formData.get("role") as string) === "admin" ? "admin" : "manager";
  const password = (formData.get("password") as string) || "";

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return { error: "User not found." };

  // Don't let the last admin demote themselves and lock everyone out.
  if (target.role === "admin" && role !== "admin") {
    const admins = await prisma.user.count({ where: { role: "admin" } });
    if (admins <= 1) return { error: "Can't remove the last admin." };
  }

  const data: { name: string | null; role: string; passwordHash?: string } = { name, role };
  if (password) {
    if (password.length < 6) return { error: "Password must be at least 6 characters." };
    data.passwordHash = hashPassword(password);
  }
  await prisma.user.update({ where: { id }, data });
  void me;
  redirect("/admin/users");
}

export async function deleteUser(formData: FormData) {
  const me = await requireAdmin();
  const id = formData.get("id") as string;
  if (id === me.id) return; // can't delete yourself
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return;
  if (target.role === "admin") {
    const admins = await prisma.user.count({ where: { role: "admin" } });
    if (admins <= 1) return; // never delete the last admin
  }
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

// ---------- site content ----------

export async function saveSettings(formData: FormData) {
  await requireUser();
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
  await requireUser();
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
    rented: formData.get("rented") === "on",
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
  await requireUser();
  const id = formData.get("id") as string;
  await prisma.car.delete({ where: { id } });
  revalidateAll();
}

// Quick on/off toggle for the "Rented" ribbon from the cars list.
export async function toggleRented(formData: FormData) {
  await requireUser();
  const id = formData.get("id") as string;
  const car = await prisma.car.findUnique({ where: { id }, select: { rented: true } });
  if (car) await prisma.car.update({ where: { id }, data: { rented: !car.rented } });
  revalidateAll();
}

// ---------- reviews ----------

export async function saveReview(formData: FormData) {
  await requireUser();
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
  await requireUser();
  await prisma.review.delete({ where: { id: formData.get("id") as string } });
  revalidateAll();
}

// ---------- fleet (calendar cars) ----------

export async function addFleetCar(formData: FormData) {
  await requireUser();
  const name = ((formData.get("name") as string) || "").trim();
  if (!name) return;
  const max = await prisma.fleetCar.aggregate({ _max: { sortOrder: true } });
  await prisma.fleetCar.create({
    data: { name, sortOrder: (max._max.sortOrder ?? 0) + 1 },
  });
  revalidatePath("/admin/calendar");
}

export async function renameFleetCar(formData: FormData) {
  await requireUser();
  const id = formData.get("id") as string;
  const name = ((formData.get("name") as string) || "").trim();
  if (!name) return;
  await prisma.fleetCar.update({ where: { id }, data: { name } });
  revalidatePath("/admin/calendar");
}

export async function deleteFleetCar(formData: FormData) {
  await requireUser();
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
  await requireUser();

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
  await requireUser();
  const id = formData.get("id") as string;
  await prisma.booking.delete({ where: { id } });
  revalidatePath("/admin/calendar");
}
