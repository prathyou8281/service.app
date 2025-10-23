import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// ✅ MySQL connection
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

/* -----------------------------------------
   🔹 GET — Fetch all vendors
------------------------------------------ */
export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM vendors ORDER BY id DESC");
    await db.end();

    return NextResponse.json({ success: true, data: rows });
  } catch (err: any) {
    console.error("❌ GET /vendors error:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}

/* -----------------------------------------
   🔹 POST — Add new vendor
------------------------------------------ */
export async function POST(req: Request) {
  try {
    const {
      username,
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

    // Check for existing vendor by email
    const [exists]: any = await db.query("SELECT id FROM vendors WHERE email = ?", [email]);
    if (exists.length > 0) {
      await db.end();
      return NextResponse.json({
        success: false,
        message: "Vendor with this email already exists.",
      });
    }

    // Hash password
    const plainPassword = password || "12345";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // ✅ Insert only into vendors table
    const [result]: any = await db.query(
      `INSERT INTO vendors (shopName, shopLocation, serviceType, experience, phone, email, password, ownerName)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        shopName,
        shopLocation,
        serviceType,
        experience,
        phone,
        email,
        hashedPassword,
        username,
      ]
    );

    await db.end();
    return NextResponse.json({
      success: true,
      message: "Vendor added successfully.",
      id: result.insertId,
    });
  } catch (err: any) {
    console.error("❌ POST /vendors error:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}

/* -----------------------------------------
   🔹 PUT — Update Vendor
------------------------------------------ */
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
      return NextResponse.json({
        success: false,
        message: "Vendor ID is required.",
      });

    const db = await connectDB();

    await db.query(
      `UPDATE vendors 
       SET ownerName=?, email=?, phone=?, shopName=?, shopLocation=?, serviceType=?, experience=? 
       WHERE id=?`,
      [username, email, phone, shopName, shopLocation, serviceType, experience, id]
    );

    await db.end();
    return NextResponse.json({
      success: true,
      message: "Vendor updated successfully.",
    });
  } catch (err: any) {
    console.error("❌ PUT /vendors error:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}

/* -----------------------------------------
   🔹 DELETE — Remove Vendor
------------------------------------------ */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({
        success: false,
        message: "Missing vendor ID.",
      });

    const db = await connectDB();
    const [result]: any = await db.query("DELETE FROM vendors WHERE id = ?", [id]);
    await db.end();

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: "Vendor not found." });
    }

    return NextResponse.json({
      success: true,
      message: "Vendor deleted successfully.",
    });
  } catch (err: any) {
    console.error("❌ DELETE /vendors error:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}
