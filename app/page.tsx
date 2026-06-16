import { prisma } from "@/lib/db";
import { getLocalizedSettings, waLink } from "@/lib/settings";
import { resolveCarImage } from "@/lib/carImage";
import { UI_STRINGS } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/locale-server";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FleetSection from "@/components/FleetSection";
import { WhyUs, About, Contact, Footer, WhatsAppFloat } from "@/components/Sections";
import Reviews from "@/components/Reviews";
import { Cursor } from "@/components/interactions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const locale = await getRequestLocale();
  const [s, cars, reviews] = await Promise.all([
    getLocalizedSettings(locale),
    prisma.car.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    }),
    prisma.review.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  const t = UI_STRINGS[locale];

  const whatsappHref = waLink(s.whatsappNumber, s.whatsappGeneric);
  const fleet = cars.map((car) => ({ ...car, image: resolveCarImage(car) }));
  const brands = Array.from(new Set(cars.map((c) => c.brand)));

  return (
    <main id="top">
      <Cursor />
      <Navbar whatsappHref={whatsappHref} t={t} locale={locale} />
      <Hero
        badge={s.heroBadge}
        title={s.heroTitle}
        subtitle={s.heroSubtitle}
        cta={s.heroCta}
        whatsappLabel={t.whatsapp}
        whatsappHref={whatsappHref}
        stats={[1, 2, 3].map((i) => ({
          value: s[`stat${i}Value`],
          label: s[`stat${i}Label`],
        }))}
        brands={brands}
      />
      <FleetSection
        cars={fleet}
        title={s.fleetTitle}
        subtitle={s.fleetSubtitle}
        whatsappNumber={s.whatsappNumber}
        template={s.whatsappTemplate}
        t={t}
      />
      <WhyUs t={t} heroImage={s.heroImage} />
      <About s={s} t={t} />
      <Reviews reviews={reviews} t={t} />
      <Contact s={s} t={t} />
      <Footer s={s} />
      <WhatsAppFloat href={whatsappHref} />
    </main>
  );
}
