import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// ✅ Connect DB
async function connectDB() {
  return mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
  });
}



 

/* ---------------------- GET ALL VENDORS ---------------------- */
export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM vendors ORDER BY id DESC");
    await db.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}

/* ---------------------- ADD NEW VENDOR ---------------------- */
export async function POST(req: Request) {
  try {
    const {
      username, // ✅ use username (not ownerName)
      email,
      password,
      phone,
      shopName,
      shopLocation,
      serviceType,
      experience,
    } = await req.json();

    if (!username || !email || !shopName)
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });

    const db = await connectDB();

    // ✅ Check if vendor already exists
    const [exists]: any = await db.query("SELECT id FROM vendors WHERE email = ?", [email]);
    if (exists.length > 0) {
      await db.end();
      return NextResponse.json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password || "12345", 10);

    await db.query(
      `INSERT INTO vendors (username, email, password, phone, shopName, shopLocation, serviceType, experience)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, phone, shopName, shopLocation, serviceType, experience]
    );

    await db.end();
    return NextResponse.json({ success: true, message: "Vendor added successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}

/* ---------------------- UPDATE VENDOR ---------------------- */
export async function PUT(req: Request) {
  try {
    const {
      id,
      username,
      email,
      phone,
      shopName,
      shopLocation,
      serviceType,
      experience,
    } = await req.json();

    if (!id)
      return NextResponse.json({ success: false, message: "Missing vendor ID" });

    const db = await connectDB();

    await db.query(
      `UPDATE vendors 
       SET username=?, email=?, phone=?, shopName=?, shopLocation=?, serviceType=?, experience=? 
       WHERE id=?`,
      [username, email, phone, shopName, shopLocation, serviceType, experience, id]
    );

    await db.end();
    return NextResponse.json({ success: true, message: "Vendor updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}

/* ---------------------- DELETE VENDOR ---------------------- */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ success: false, message: "Missing vendor ID" });

    const db = await connectDB();
    await db.query("DELETE FROM vendors WHERE id = ?", [id]);
    await db.end();

    return NextResponse.json({ success: true, message: "Vendor deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
