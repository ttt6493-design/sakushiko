import { NextResponse, type NextRequest } from 'next/server';

const LOCALE_COOKIE = 'lang';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * When a request carries ?lang=ja|en (shared / SEO links), make that locale visible to the
 * root layout (which cannot read searchParams) via a request header, and persist it as the
 * cookie so subsequent navigations stay in that language.
 */
export function proxy(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get(LOCALE_COOKIE);
  if (lang !== 'ja' && lang !== 'en') return NextResponse.next();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-lang', lang);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (request.cookies.get(LOCALE_COOKIE)?.value !== lang) {
    response.cookies.set(LOCALE_COOKIE, lang, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
    });
  }
  return response;
}

export const config = {
  // Skip static assets and API routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest).*)'],
};
