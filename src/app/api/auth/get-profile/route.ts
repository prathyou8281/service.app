// /api/auth/get-profile/route.ts

import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req: Request) {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ success: false, message: "Missing user ID" });

    // Fetch user
    const [userRows]: any = await db.execute(
      `SELECT id, name AS username, email, phone, 'User' AS role, NOW() AS joined FROM users WHERE id = ?`,
      [id]
    );

    if (userRows.length === 0)
      return NextResponse.json({ success: false, message: "User not found" });

    // Fetch addresses
    const [addressRows]: any = await db.execute(
      `SELECT id, address, city, state, country, pin_code, status FROM users_addresses WHERE user_id = ? ORDER BY id DESC`,
      [id]
    );

    return NextResponse.json({
      success: true,
      user: { ...userRows[0], addresses: addressRows },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message });
  } finally {
    await db.end();
  }
}
