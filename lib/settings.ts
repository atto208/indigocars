import { prisma } from "./db";
import { CONTENT, LOCALIZED_KEYS, type Locale } from "./i18n";

// Every editable piece of text / image on the website, with sensible defaults.
export const DEFAULT_SETTINGS: Record<string, string> = {
  // Brand
  siteName: "Indigo Cars",
  tagline: "Premium Car Rental in Istanbul",

  // Hero
  heroBadge: "Premium Car Rental · Istanbul",
  heroTitle: "Rent the Car.\nOwn the City.",
  heroSubtitle:
    "Premium car rental in the heart of Istanbul. New models, transparent prices, delivered to your door — airport, hotel or anywhere in the city.",
  heroCta: "View Our Cars",
  heroImage: "/cars/citroen-c4x.jpg",
  heroImageCaption: "Citroën C4 X · Comfort Class",

  // Fleet section
  fleetTitle: "Our Fleet",
  fleetSubtitle:
    "From smart city cars to executive sedans and family vans — every car is recent, fully insured and meticulously maintained.",

  // About
  aboutTitle: "About Indigo Cars",
  aboutText:
    "Indigo Cars is an Istanbul-based car rental company built on one simple idea: renting a car should be effortless. No hidden fees, no endless paperwork, no surprises.\n\nOur fleet of 25+ vehicles covers everything from economical city cars to premium sedans and spacious vans. Every car is serviced regularly, deep-cleaned between rentals and fully insured.\n\nWe deliver and collect anywhere in Istanbul — including Istanbul Airport (IST) and Sabiha Gökçen (SAW) — 7 days a week. One WhatsApp message is all it takes.",
  aboutImage: "/cars/renault-megane.jpg",
  stat1Value: "25+",
  stat1Label: "Cars in Fleet",
  stat2Value: "7/24",
  stat2Label: "Support & Delivery",
  stat3Value: "100%",
  stat3Label: "Insured Vehicles",
  stat4Value: "4.9★",
  stat4Label: "Customer Rating",

  // Contact
  contactTitle: "Get in Touch",
  contactSubtitle:
    "Have a question or want to reserve a car? Message us on WhatsApp — we reply within minutes.",
  phone: "+90 546 646 01 53",
  whatsappNumber: "905466460153", // digits only, with country code
  email: "info@indigocars.co",
  address: "Istanbul, Türkiye",
  instagram: "https://instagram.com/indigocars",
  website: "www.indigocars.co",
  workingHours: "Every day · 09:00 – 22:00 (WhatsApp 24/7)",

  // Booking message template — {car} is replaced with the car name
  whatsappTemplate:
    "Hello Indigo Cars! 👋 I would like to book the {car}. Could you tell me about availability and prices?",
  whatsappGeneric:
    "Hello Indigo Cars! 👋 I would like to rent a car in Istanbul. Could you help me?",

  // Footer
  footerText:
    "Indigo Cars — premium car rental in Istanbul. Airport delivery, full insurance, 24/7 support.",
};

export type SiteSettings = typeof DEFAULT_SETTINGS;

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await prisma.setting.findMany();
  const map: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) if (!row.key.includes(":")) map[row.key] = row.value;
  return map;
}

// Locale-aware settings. Merge order:
//   defaults → DB plain keys (English text + shared neutral fields)
//   → built-in translations (CONTENT) → DB "<locale>:key" admin overrides.
// So an admin's per-language edits win, then our translations, and shared
// fields (phone, images, …) always come from the plain keys.
export async function getLocalizedSettings(locale: Locale): Promise<Record<string, string>> {
  const rows = await prisma.setting.findMany();
  const map: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) if (!row.key.includes(":")) map[row.key] = row.value;

  if (locale !== "en") {
    const tr = CONTENT[locale] as Record<string, string | undefined>;
    for (const k of LOCALIZED_KEYS) {
      const v = tr[k];
      if (v != null) map[k] = v;
    }
    const prefix = `${locale}:`;
    for (const row of rows) {
      if (row.key.startsWith(prefix)) map[row.key.slice(prefix.length)] = row.value;
    }
  }
  return map;
}

export function waLink(number: string, message: string): string {
  const digits = number.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
