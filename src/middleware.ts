import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const userDataCookie = request.cookies.get("userData")?.value;

  // Define public routes
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/welcome") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/user/login") ||
    pathname.startsWith("/user/register") ||
    pathname.startsWith("/vendor/login") ||
    pathname.startsWith("/vendor/register") ||
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/technician/login") ||
    pathname.startsWith("/technician/register") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/explore") ||
    pathname.includes("favicon.ico") ||
    pathname.startsWith("/_next");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for session
  if (!userDataCookie) {
    // Determine where to redirect based on the route they tried to access
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (pathname.startsWith("/vendor")) {
      return NextResponse.redirect(new URL("/vendor/login", request.url));
    }
    if (pathname.startsWith("/technician")) {
      return NextResponse.redirect(new URL("/technician/login", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Parse user data safely
  let user: any;
  try {
    user = JSON.parse(userDataCookie);
  } catch (e) {
    // Corrupted cookie, clear it and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("userData");
    return response;
  }

  const role = user.role?.toLowerCase();

  // Role-based protection
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (pathname.startsWith("/vendor") && role !== "vendor") {
    return NextResponse.redirect(new URL("/vendor/login", request.url));
  }

  if (pathname.startsWith("/technician") && role !== "technician") {
    return NextResponse.redirect(new URL("/technician/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
