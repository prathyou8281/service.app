import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

async function connectDB() {
  const db = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "prathyu8281",
    database: "serviceapp",
    port: 3307,
  });
  return db;
}

export async function GET() {
  try {
    const db = await connectDB();

    const [totalUsers]: any = await db.query("SELECT COUNT(*) AS total FROM users");
    const [vendors]: any = await db.query("SELECT COUNT(*) AS total FROM vendors");
    const [technicians]: any = await db.query("SELECT COUNT(*) AS total FROM technicians");

    await db.end();

    return NextResponse.json({
      success: true,
      data: {
        users: totalUsers[0].total,
        registeredUsers: totalUsers[0].total, // same for now (you can separate later)
        vendors: vendors[0].total,
        technicians: technicians[0]?.total ?? 0,
      },
    });
  } catch (err: any) {
    console.error("❌ METRICS API ERROR:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}
