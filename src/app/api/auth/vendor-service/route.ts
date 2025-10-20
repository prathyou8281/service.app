import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  let db: mysql.Connection | null = null;
  try {
    const { email, role, serviceName } = await req.json();

    if (!role || !serviceName) {
      return NextResponse.json(
        { success: false, message: "Missing role or service" },
        { status: 400 }
      );
    }

    // ✅ Connect to DB
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // ✅ Save the selected service (email optional for pre-registration)
    await db.execute(
      "INSERT INTO vendor_services (email, role, serviceName) VALUES (?, ?, ?)",
      [email || null, role, serviceName]
    );

    return NextResponse.json({
      success: true,
      message: "✅ Service stored successfully.",
    });
  } catch (err: any) {
    console.error("🚨 Vendor Service Error:", err.message || err);
    return NextResponse.json(
      { success: false, message: "Server error while saving service." },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
