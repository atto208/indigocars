import Link from "next/link";
import { getLocalizedSettings } from "@/lib/settings";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n";
import { saveSettings } from "../actions";
import ImageUpload from "../ImageUpload";
import SaveButton from "./SaveButton";

export const dynamic = "force-dynamic";

function Field({
  name, label, value, textarea, hint,
}: {
  name: string; label: string; value: string; textarea?: boolean; hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-soft">{label}</label>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={value}
          rows={value.length > 200 ? 7 : 3}
          dir="auto"
          className="w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none transition focus:border-brand-light"
        />
      ) : (
        <input
          name={name}
          defaultValue={value}
          dir="auto"
          className="w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none transition focus:border-brand-light"
        />
      )}
      {hint && <p className="mt-1 text-xs text-brand-soft/60">{hint}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/5 bg-ink-soft p-6">
      <h2 className="font-display text-sm font-bold uppercase tracking-widest text-brand-light">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export default async function ContentPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const locale: Locale = isLocale(sp.lang) ? sp.lang : "en";
  const isEn = locale === "en";
  const s = await getLocalizedSettings(locale);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white">Website Content</h1>
      <p className="mt-2 text-sm text-brand-soft">
        Edit any text or photo on the website. Changes go live as soon as you press Save.
      </p>

      {/* language tabs */}
      <div className="mt-5 flex flex-wrap gap-2">
        {LOCALES.map((l) => (
          <Link
            key={l.code}
            href={l.code === "en" ? "/admin/content" : `/admin/content?lang=${l.code}`}
            className={`rounded-full px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wider transition ${
              l.code === locale ? "bg-brand text-white" : "border border-white/10 text-brand-soft hover:text-white"
            }`}
          >
            {l.name}
          </Link>
        ))}
      </div>
      {!isEn && (
        <p className="mt-3 rounded-lg border border-brand-light/20 bg-brand/20 px-4 py-2.5 text-xs text-brand-soft">
          Editing the <b className="text-white">{LOCALES.find((l) => l.code === locale)?.name}</b> translation.
          Photos, phone, email and links are shared across all languages — edit those on the{" "}
          <Link href="/admin/content" className="text-accent-light underline">English</Link> tab.
          Leave a field as-is to keep the built-in translation.
        </p>
      )}

      <form action={saveSettings} className="mt-6 space-y-6">
        <input type="hidden" name="locale" value={locale} />

        <Section title="Hero (top of the page)">
          <Field name="heroBadge" label="Small badge text" value={s.heroBadge} />
          <Field name="heroTitle" label="Headline" value={s.heroTitle} textarea hint="Use a new line to split the headline into two lines." />
          <Field name="heroSubtitle" label="Subtitle" value={s.heroSubtitle} textarea />
          <Field name="heroCta" label="Button text" value={s.heroCta} />
          {isEn && <ImageUpload name="heroImage" defaultValue={s.heroImage} label="Featured car photo" />}
          <Field name="heroImageCaption" label="Featured car caption" value={s.heroImageCaption} />
        </Section>

        <Section title="Fleet section">
          <Field name="fleetTitle" label="Title" value={s.fleetTitle} />
          <Field name="fleetSubtitle" label="Subtitle" value={s.fleetSubtitle} textarea />
        </Section>

        <Section title="About section">
          <Field name="aboutTitle" label="Title" value={s.aboutTitle} />
          <Field name="aboutText" label="Text" value={s.aboutText} textarea hint="Empty line = new paragraph." />
          {isEn && <ImageUpload name="aboutImage" defaultValue={s.aboutImage} label="About photo" />}
          <div className="grid grid-cols-2 gap-4">
            {isEn && <Field name="stat1Value" label="Stat 1 — number" value={s.stat1Value} />}
            <Field name="stat1Label" label="Stat 1 — label" value={s.stat1Label} />
            {isEn && <Field name="stat2Value" label="Stat 2 — number" value={s.stat2Value} />}
            <Field name="stat2Label" label="Stat 2 — label" value={s.stat2Label} />
            {isEn && <Field name="stat3Value" label="Stat 3 — number" value={s.stat3Value} />}
            <Field name="stat3Label" label="Stat 3 — label" value={s.stat3Label} />
            {isEn && <Field name="stat4Value" label="Stat 4 — number" value={s.stat4Value} />}
            <Field name="stat4Label" label="Stat 4 — label" value={s.stat4Label} />
          </div>
        </Section>

        <Section title="Contact & WhatsApp">
          <Field name="contactTitle" label="Title" value={s.contactTitle} />
          <Field name="contactSubtitle" label="Subtitle" value={s.contactSubtitle} textarea />
          <div className="grid gap-4 sm:grid-cols-2">
            {isEn && <Field name="phone" label="Phone (shown on site)" value={s.phone} />}
            {isEn && <Field name="whatsappNumber" label="WhatsApp number" value={s.whatsappNumber} hint="Digits only with country code, e.g. 905321234567" />}
            {isEn && <Field name="email" label="Email" value={s.email} />}
            <Field name="address" label="Address" value={s.address} />
            {isEn && <Field name="instagram" label="Instagram URL" value={s.instagram} />}
            {isEn && <Field name="website" label="Website (shown in footer)" value={s.website} />}
            <Field name="workingHours" label="Working hours" value={s.workingHours} />
          </div>
          <Field name="whatsappTemplate" label="WhatsApp message for “Book Now” on a car" value={s.whatsappTemplate} textarea hint="{car} is replaced with the car's name automatically." />
          <Field name="whatsappGeneric" label="WhatsApp message (general buttons)" value={s.whatsappGeneric} textarea />
        </Section>

        <Section title="Footer">
          <Field name="footerText" label="Footer text" value={s.footerText} textarea />
        </Section>

        <SaveButton />
      </form>
    </div>
  );
}
