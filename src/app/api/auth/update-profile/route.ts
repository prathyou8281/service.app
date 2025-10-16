import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  try {
    const { id, username, phone, address } = await req.json();

    if (!id) return NextResponse.json({ success: false, message: "Missing user ID" });

    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    await db.execute(
      "UPDATE users SET username = ?, phone = ?, address = ? WHERE id = ?",
      [username || null, phone || null, address || null, id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update Profile Error:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
