import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const userData = request.cookies.get("userData")?.value;

  /* -------------------------------------------------
   * 1️⃣ PUBLIC ROUTES (ALWAYS ALLOW)
   * ------------------------------------------------- */
  if (
    pathname === "/" ||
    pathname.startsWith("/welcome") ||
    pathname.startsWith("/user/login") ||
    pathname.startsWith("/user/register") ||
    pathname.startsWith("/vendor/login") ||
    pathname.startsWith("/vendor/register") ||
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/technician/login")
    
  ) {
    return NextResponse.next();
  }

  /* -------------------------------------------------
   * 2️⃣ DASHBOARD CHECKS
   * ------------------------------------------------- */
  const isVendorRoute = pathname.startsWith("/vendor");
  const isAdminRoute = pathname.startsWith("/admin");
  const isTechnicianRoute = pathname.startsWith("/technician");

  /* -------------------------------------------------
   * 3️⃣ NOT LOGGED IN
   * ------------------------------------------------- */
  if (!userData) {
    if (isVendorRoute) {
      return NextResponse.redirect(
        new URL("/vendor/login", request.url)
      );
    }

    if (isAdminRoute) {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }

    if (isTechnicianRoute) {
      return NextResponse.redirect(
        new URL("/technician/login", request.url)
      );
    }

    return NextResponse.redirect(
      new URL("/user/login", request.url)
    );
  }

  /* -------------------------------------------------
   * 4️⃣ PARSE COOKIE SAFELY
   * ------------------------------------------------- */
  let user: any;
  try {
    user = JSON.parse(userData);
  } catch {
    // corrupted cookie → force logout
    return NextResponse.redirect(
      new URL("/user/login", request.url)
    );
  }

  const role = user.role;

  /* -------------------------------------------------
   * 5️⃣ ROLE-BASED ACCESS
   * ------------------------------------------------- */
  if (isVendorRoute && role !== "vendor") {
    return NextResponse.redirect(
      new URL("/vendor/login", request.url)
    );
  }

  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  if (isTechnicianRoute && role !== "technician") {
    return NextResponse.redirect(
      new URL("/technician/login", request.url)
    );
  }

  /* -------------------------------------------------
   * 6️⃣ ALLOW REQUEST
   * ------------------------------------------------- */
  return NextResponse.next();
}

/* -------------------------------------------------
 * 7️⃣ MATCHER (KEEP IT BROAD)
 * ------------------------------------------------- */
export const config = {
  matcher: [
    "/vendor/:path*",
    "/admin/:path*",
    "/technician/:path*",
  ],
};
