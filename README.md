# Indigo Cars — Website & Admin

Marketing landing page + internal admin panel for Indigo Cars (car rental, Istanbul).
No public booking engine — "Book Now" opens WhatsApp with a pre-filled message.

## Run it

```bash
npm install
npm run db:push    # create the SQLite database (first time only)
npm run db:seed    # fill it with the starter cars & content (first time only)
npm run dev
```

- Website: http://localhost:3000
- Admin panel: http://localhost:3000/admin — password is `ADMIN_PASSWORD` in `.env` (default: `indigo2026`)

## What's inside

| Area | Where |
|---|---|
| Landing page (hero, fleet, about, contact) | `/` |
| Edit all texts & photos | `/admin/content` |
| Add / edit / hide cars on the website | `/admin/cars` |
| Internal booking calendar (per physical car) | `/admin/calendar` |

Notes:

- **Website cars** are one card per *model* (no duplicates). The **calendar fleet** is the list of *physical* cars — you can have "Fiat Egea #1…#4" there.
- **Same-day handover** is supported: a new rental can start on the same day another one ends; the calendar draws bars from mid-day to mid-day so both fit.
- Brand assets (logo, fonts, colors `#383E7E` / `#008067` / `#464555`) come from the `INDIGO CARS BRANDING zip` folder.

## Stack

Next.js 16 (App Router) · Tailwind 4 · Prisma + SQLite · Saira & Raleway fonts.

For deployment (e.g. Vercel) the SQLite file and local uploads won't persist — switch `prisma/schema.prisma` to a hosted Postgres and the upload route to Vercel Blob first.
