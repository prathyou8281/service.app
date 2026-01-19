import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT id, username, email, role, phone FROM users");
    return NextResponse.json({ success: true, data: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, username, email, role, phone } = await req.json();
    if (!id)
      return NextResponse.json({ success: false, message: "Missing ID" }, { status: 400 });

    await db.query(
      "UPDATE users SET username = ?, email = ?, role = ?, phone = ? WHERE id = ?",
      [username, email, role, phone, id]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
