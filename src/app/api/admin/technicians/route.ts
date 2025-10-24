import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// ✅ Connect DB
async function connectDB() {
  return mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "prathyu8281",
    database: "serviceapp",
    port: 3307,
  });
}

/* ---------------------- GET ALL TECHNICIANS ---------------------- */
export async function GET() {
  try {
    const db = await connectDB();

    // ✅ Select all columns properly mapped to username/fullName
    const [rows] = await db.query(`
      SELECT 
        id,
        username,
        email,
        phone,
        skill,
        experience,
        availability,
        created_at
      FROM technicians
      ORDER BY id DESC
    `);

    await db.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (err: any) {
    console.error("❌ GET Technicians Error:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}

/* ---------------------- ADD TECHNICIAN ---------------------- */
export async function POST(req: Request) {
  try {
    const { username, email, password, phone, skill, experience } = await req.json();

    if (!username || !email) {
      return NextResponse.json({ success: false, message: "Missing required fields" });
    }

    const db = await connectDB();

    const [exists]: any = await db.query("SELECT id FROM technicians WHERE email = ?", [email]);
    if (exists.length > 0) {
      await db.end();
      return NextResponse.json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password || "12345", 10);

    // ✅ Insert technician with proper username
    await db.query(
      `INSERT INTO technicians 
        (username, email, password, phone, skill, experience, availability, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'available', NOW())`,
      [username, email, hashedPassword, phone || "", skill || "", experience || ""]
    );

    await db.end();
    return NextResponse.json({ success: true, message: "Technician added successfully" });
  } catch (err: any) {
    console.error("❌ POST Technician Error:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}

/* ---------------------- UPDATE TECHNICIAN ---------------------- */
export async function PUT(req: Request) {
  try {
    const { id, username, email, phone, skill, experience } = await req.json();

    if (!id)
      return NextResponse.json({ success: false, message: "Missing technician ID" });

    const db = await connectDB();

    await db.query(
      `UPDATE technicians 
       SET username=?, email=?, phone=?, skill=?, experience=? 
       WHERE id=?`,
      [username, email, phone, skill, experience, id]
    );

    await db.end();
    return NextResponse.json({ success: true, message: "Technician updated successfully" });
  } catch (err: any) {
    console.error("❌ PUT Technician Error:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}

/* ---------------------- DELETE TECHNICIAN ---------------------- */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ success: false, message: "Missing technician ID" });

    const db = await connectDB();
    await db.query("DELETE FROM technicians WHERE id = ?", [id]);
    await db.end();

    return NextResponse.json({ success: true, message: "Technician deleted successfully" });
  } catch (err: any) {
    console.error("❌ DELETE Technician Error:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}
