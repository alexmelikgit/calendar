import { NextResponse, type NextRequest } from "next/server";

// Kept self-contained on purpose: Proxy runs separately from the app.
const locales = ["hy", "en"];
/** The site always opens in Armenian; English is available from the switcher. */
const defaultLocale = "hy";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;

  request.nextUrl.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next.js internals and files with an extension (images, favicon…).
  matcher: ["/((?!_next|.*\\..*).*)"],
};
