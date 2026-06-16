// Replaces the demo data with Indigo Cars' real fleet (from the owner's table).
// Website Car rows = one per model (deduped). FleetCar = the physical cars for
// the calendar (with year in the name). Run: npx tsx scripts/reset-real-fleet.mjs
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const HAVE = "studio"; // marker: model has a generated studio image
const SOON = "/cars/_coming-soon.svg";

// [name, brand, category, file|null, seats, hp, transmission, fuel, luggage, year, featured, imaginMake, imaginModel]
const cars = [
  ["Renault Megane Sedan", "Renault", "Comfort", "renault-megane", 5, 115, "Automatic", "Diesel", 3, 2023, false, "renault", "megane"],
  ["Fiat Egea", "Fiat", "Economy", "fiat-egea", 5, 95, "Manual", "Diesel", 3, 2023, false, "fiat", "tipo"],
  ["Volkswagen Polo", "Volkswagen", "Economy", "vw-polo", 5, 95, "Automatic", "Petrol", 2, 2023, false, "volkswagen", "polo"],
  ["Renault Clio", "Renault", "Economy", "renault-clio", 5, 90, "Automatic", "Petrol", 2, 2024, true, "renault", "clio"],
  ["Citroën C4 X", "Citroën", "Comfort", "citroen-c4x", 5, 130, "Automatic", "Petrol", 3, 2023, true, "citroen", "c4-x"],
  ["Renault Taliant", "Renault", "Economy", "renault-taliant", 5, 90, "Automatic", "Petrol", 3, 2023, false, "renault", "taliant"],
  ["Peugeot 5008", "Peugeot", "SUV", "peugeot-5008", 7, 130, "Automatic", "Diesel", 4, 2023, true, "peugeot", "5008"],
  ["Kia Stonic", "Kia", "SUV", "kia-stonic", 5, 100, "Automatic", "Petrol", 3, 2024, false, "kia", "stonic"],
  ["Dacia Sandero", "Dacia", "Economy", "dacia-sandero", 5, 90, "Manual", "Petrol", 2, 2023, false, "dacia", "sandero"],
  ["Opel Corsa", "Opel", "Economy", "opel-corsa", 5, 100, "Automatic", "Petrol", 2, 2023, false, "opel", "corsa"],
  ["Toyota Corolla Hybrid", "Toyota", "Comfort", "toyota-corolla", 5, 140, "Automatic", "Hybrid", 3, 2021, true, "toyota", "corolla"],
  ["Hyundai i20", "Hyundai", "Economy", "hyundai-i20", 5, 100, "Automatic", "Petrol", 2, 2024, false, "hyundai", "i20"],
  ["Peugeot 208", "Peugeot", "Economy", "peugeot-208", 5, 100, "Automatic", "Petrol", 2, 2024, false, "peugeot", "208"],
  ["Peugeot 3008", "Peugeot", "SUV", "peugeot-3008", 5, 130, "Automatic", "Diesel", 4, 2024, true, "peugeot", "3008"],
  ["Volkswagen Taigo", "Volkswagen", "SUV", "vw-taigo", 5, 110, "Automatic", "Petrol", 3, 2024, false, "volkswagen", "taigo"],
];

// Physical fleet for the calendar — the owner's 19 rows, year in the name.
const fleet = [
  "Renault Megane — 2023",
  "Fiat Egea #1 — 2022",
  "Volkswagen Polo — 2023",
  "Renault Clio #1 — 2022",
  "Renault Taliant — 2023",
  "Peugeot 5008 — 2023",
  "Kia Stonic — 2024",
  "Dacia Sandero — 2023",
  "Opel Corsa — 2023",
  "Fiat Egea #2 — 2023",
  "Toyota Corolla Hybrid #1 — 2021",
  "Hyundai i20 #1 — 2023",
  "Toyota Corolla Hybrid #2 — 2020",
  "Hyundai i20 #2 — 2024",
  "Renault Clio #2 Evolution — 2024",
  "Citroën C4 X — 2023",
  "Peugeot 208 — 2024",
  "Peugeot 3008 — 2024",
  "Volkswagen Taigo — 2024",
];

function day(offset) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

async function main() {
  await prisma.booking.deleteMany();
  await prisma.fleetCar.deleteMany();
  await prisma.car.deleteMany();

  let i = 0;
  for (const [name, brand, category, file, seats, hp, transmission, fuel, luggage, year, featured, im, imm] of cars) {
    await prisma.car.create({
      data: {
        name, brand, category,
        image: file ? `/cars/${file}.jpg` : SOON,
        seats, horsepower: hp, transmission, fuel, luggage, year,
        featured, imaginMake: im, imaginModel: imm,
        published: true, sortOrder: i++,
      },
    });
  }
  console.log(`Seeded ${cars.length} real car models (${cars.filter((c) => c[3]).length} with studio images)`);

  let j = 0;
  const created = [];
  for (const name of fleet) {
    created.push(await prisma.fleetCar.create({ data: { name, sortOrder: j++ } }));
  }
  console.log(`Seeded ${fleet.length} physical fleet cars`);

  // two example bookings incl. a same-day handover on Fiat Egea #1
  const egea1 = created.find((c) => c.name.startsWith("Fiat Egea #1"));
  await prisma.booking.createMany({
    data: [
      { fleetCarId: egea1.id, startDate: day(1), endDate: day(4), firstName: "Ali", lastName: "Yılmaz", passportNumber: "U1234567", licenseNumber: "TR-998877", phone: "+90 532 111 22 33" },
      { fleetCarId: egea1.id, startDate: day(4), endDate: day(9), firstName: "Sara", lastName: "Hassan", passportNumber: "P7654321", licenseNumber: "AE-445566", phone: "+971 50 123 4567", notes: "Same-day handover after the previous rental" },
    ],
  });
  console.log("Seeded 2 example bookings (incl. same-day turnover)");
}

main().finally(() => prisma.$disconnect());
