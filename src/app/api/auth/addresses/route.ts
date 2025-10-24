// /api/auth/addresses/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  try {
    const { userId, address, city, state, country, pin_code, type } =
      await req.json();

    if (!userId || !address || !city || !state || !country || !pin_code)
      return NextResponse.json({
        success: false,
        message: "All address fields are required.",
      });

    await db.execute(
      `INSERT INTO users_addresses (user_id, address, city, state, country, pin_code, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
      [userId, address, city, state, country, pin_code]
    );

    return NextResponse.json({ success: true, message: "Address added!" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message });
  } finally {
    await db.end();
  }
}
