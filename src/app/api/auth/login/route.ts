// app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Expect JSON: { email, password }
  const { email, password } = await req.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json({ ok: false, message: "Email and password required" }, { status: 400 });
  }

  // TODO: Replace with your real auth check against DB
  // For now, accept any non-empty email/password
  const res = NextResponse.json({ ok: true });

  // Mark session as logged-in
  res.cookies.set({
    name: "auth",
    value: "true",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  // Optional: store email (also HTTP-only)
  res.cookies.set({
    name: "userEmail",
    value: encodeURIComponent(email),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return res;
}
