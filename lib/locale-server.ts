import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, pickLocale, type Locale } from "./i18n";

// Resolve the active locale for a request: explicit cookie choice wins,
// otherwise fall back to the visitor's browser Accept-Language.
export async function getRequestLocale(): Promise<Locale> {
  const cookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;
  if (cookie) return DEFAULT_LOCALE; // unknown explicit value
  const accept = (await headers()).get("accept-language");
  return pickLocale(accept);
}
