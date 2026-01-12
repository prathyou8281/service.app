import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const userData = request.cookies.get("userData")?.value;

  // 🚫 Not logged in
  if (!userData) {
    if (
      pathname.startsWith("/vendor") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/technician")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  let user;
  try {
    user = JSON.parse(userData);
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = user.role?.toLowerCase();

  // 🔒 Vendor protection
  if (pathname.startsWith("/vendor") && role !== "vendor") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔒 Admin protection
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔒 Technician protection
  if (pathname.startsWith("/technician") && role !== "technician") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
