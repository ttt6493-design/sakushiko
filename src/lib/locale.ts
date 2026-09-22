import { cookies, headers } from 'next/headers';
import { detectLocale, type Locale } from './i18n';

export const LOCALE_COOKIE = 'lang';

function isLocale(value: string | undefined | null): value is Locale {
  return value === 'ja' || value === 'en';
}

/**
 * Resolve the current locale on the server.
 * Priority: explicit ?lang= param (shareable links; also forwarded by src/proxy.ts as x-lang
 * so the root layout sees it) > cookie set by the switcher > Accept-Language.
 */
export async function getLocale(paramLang?: string): Promise<Locale> {
  if (isLocale(paramLang)) return paramLang;

  const headerStore = await headers();
  const fromProxy = headerStore.get('x-lang');
  if (isLocale(fromProxy)) return fromProxy;

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;

  return detectLocale(headerStore.get('accept-language'));
}
