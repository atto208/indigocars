import type { Metadata } from "next";
import localFont from "next/font/local";
import { dirOf } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/locale-server";
import "./globals.css";

const saira = localFont({
  src: "./fonts/Saira.ttf",
  variable: "--font-saira",
  display: "swap",
});

const raleway = localFont({
  src: "./fonts/Raleway.ttf",
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Indigo Cars — Premium Car Rental in Istanbul",
  description:
    "Rent a car in Istanbul with Indigo Cars. 25+ modern, fully insured vehicles — economy to luxury. Airport delivery, transparent prices, 24/7 WhatsApp support.",
  openGraph: {
    title: "Indigo Cars — Premium Car Rental in Istanbul",
    description:
      "25+ modern, fully insured rental cars in Istanbul. Airport delivery & 24/7 WhatsApp support.",
    images: ["/brand/icon-circle.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale} dir={dirOf(locale)}>
      <body className={`${saira.variable} ${raleway.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
