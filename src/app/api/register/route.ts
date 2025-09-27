import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err as Error; // 👈 no more `any`
    console.error("❌ Register error:", error.message);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
