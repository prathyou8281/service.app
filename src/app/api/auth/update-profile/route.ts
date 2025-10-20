import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  let db: mysql.Connection | null = null;

  try {
    const {
      id,
      username,
      phone,
      address,
      role,
      shopName,
      shopLocation,
      skill,
      experience,
    } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "❌ Missing user ID." },
        { status: 400 }
      );
    }

    // 🧠 Connect to your MySQL DB
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Base query
    let query = "UPDATE users SET username = ?, phone = ?, address = ?";
    const values: (string | number | null)[] = [
      username || null,
      phone || null,
      address || null,
    ];

    // Role-specific fields
    if (role === "Vendor") {
      query += ", shopName = ?, shopLocation = ?";
      values.push(shopName || null, shopLocation || null);
    } else if (role === "Technician") {
      query += ", skill = ?, experience = ?";
      values.push(skill || null, experience || null);
    }

    query += " WHERE id = ?";
    values.push(id);

    const [result]: any = await db.execute(query, values);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "⚠️ User not found or no changes made." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "✅ Profile updated successfully!",
    });
  } catch (error: any) {
    console.error("🚨 Update Profile Error:", error.message || error);
    return NextResponse.json(
      { success: false, message: "Server error while updating profile." },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
