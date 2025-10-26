import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  let db: mysql.Connection | null = null;

  try {
    // 📨 Parse request
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: "Please enter both email and password.",
      });
    }

    // 🧩 Connect to DB
     db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });


    // 🔍 Find vendor by email
    const [rows]: any = await db.execute(
      "SELECT * FROM vendors WHERE email = ? LIMIT 1",
      [email.trim()]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Vendor not found.",
      });
    }

    const vendor = rows[0];

    // 🔒 Compare passwords
    const passwordMatch = await bcrypt.compare(password, vendor.password);
    if (!passwordMatch) {
      return NextResponse.json({
        success: false,
        message: "Invalid password.",
      });
    }

    // ✅ Successful login
    return NextResponse.json({
      success: true,
      message: "Login successful!",
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        description: vendor.description,
        profile_photo: vendor.profile_photo,
        status: vendor.status,
        created_at: vendor.created_at,
        updated_at: vendor.updated_at,
      },
    });
  } catch (error: any) {
    // 🛑 Detailed logging
    console.error("Vendor Login Error →", error);

    // Return error details for debugging (only during development)
    return NextResponse.json({
      success: false,
      message: "Server error occurred while logging in.",
      error: error.message || error,
    });
  } finally {
    if (db) await db.end();
  }
}
