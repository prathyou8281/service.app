import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Missing user ID" });

    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    if ((rows as any[]).length === 0)
      return NextResponse.json({ success: false, message: "User not found" });

    const user = (rows as any[])[0];
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role || "Member",
        joined: new Date(user.created_at).toLocaleDateString(),
      },
    });
  } catch (err) {
    console.error("Get Profile Error:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
