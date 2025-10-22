import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

/* -----------------------------------------
   ✅ MySQL Database Connection
------------------------------------------ */
async function connectDB() {
  try {
    const db = await mysql.createConnection({
      host: "127.0.0.1",
      user: "root",
      password: "prathyu8281", // your MySQL password
      database: "serviceapp",   // your DB name
      port: 3307,               // confirmed port
    });
    return db;
  } catch (err: any) {
    console.error("❌ Database connection failed:", err.message);
    throw new Error("Database connection failed: " + err.message);
  }
}

/* -----------------------------------------
   🔹 GET — Fetch all Vendors
------------------------------------------ */
export async function GET() {
  try {
    const db = await connectDB();

    // join vendors + users to show full details
    const [rows] = await db.query(`
      SELECT v.id, v.user_id, u.username, u.email, u.phone,
             v.shopName, v.shopLocation, v.serviceType, v.experience
      FROM vendors v
      JOIN users u ON v.user_id = u.id
      ORDER BY v.id DESC
    `);

    await db.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (err: any) {
    console.error("❌ GET /vendors error:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}

/* -----------------------------------------
   🔹 POST — Add New Vendor
------------------------------------------ */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      username,
      email,
      phone,
      shopName,
      shopLocation,
      serviceType,
      experience,
    } = body;

    if (!username || !email || !phone) {
      return NextResponse.json({
        success: false,
        message: "Username, email, and phone are required.",
      });
    }

    const db = await connectDB();

    // Check if this email already exists in users
    const [existing]: any = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      await db.end();
      return NextResponse.json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // Insert into users table first (for login / authentication)
    const defaultPassword = "$2b$10$O5z2UqH.XrVPlYJFrQkD8uhyOjxCv3.HZCnEfDR7E5pJmN6N7Pmqi"; // bcrypt hash for "12345"
    const [userResult]: any = await db.query(
      `INSERT INTO users (username, email, password, role, phone)
       VALUES (?, ?, ?, 'Vendor', ?)`,
      [username, email, defaultPassword, phone]
    );

    const newUserId = userResult.insertId;

    // Insert vendor details in vendors table
    const [vendorResult]: any = await db.query(
      `INSERT INTO vendors (user_id, shopName, shopLocation, serviceType, experience, phone, email, password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newUserId,
        shopName || null,
        shopLocation || null,
        serviceType || null,
        experience || null,
        phone,
        email,
        defaultPassword,
      ]
    );

    await db.end();

    if (vendorResult.affectedRows === 1) {
      return NextResponse.json({
        success: true,
        message: "Vendor added successfully.",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Insert failed.",
      });
    }
  } catch (err: any) {
    console.error("❌ POST /vendors error:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}

/* -----------------------------------------
   🔹 PUT — Update Vendor Info
------------------------------------------ */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,          // vendor table ID
      username,
      email,
      phone,
      shopName,
      shopLocation,
      serviceType,
      experience,
    } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Vendor ID is required.",
      });
    }

    const db = await connectDB();

    // Update both tables: vendors + users
    await db.query(
      `UPDATE vendors SET shopName=?, shopLocation=?, serviceType=?, experience=?, phone=?, email=? 
       WHERE id=?`,
      [shopName, shopLocation, serviceType, experience, phone, email, id]
    );

    await db.query(
      `UPDATE users u
       JOIN vendors v ON u.id = v.user_id
       SET u.username=?, u.email=?, u.phone=?
       WHERE v.id=?`,
      [username, email, phone, id]
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

    // Get the user_id linked to this vendor
    const [vendorRow]: any = await db.query(
      "SELECT user_id FROM vendors WHERE id = ?",
      [id]
    );
    if (vendorRow.length === 0) {
      await db.end();
      return NextResponse.json({
        success: false,
        message: "Vendor not found.",
      });
    }

    const userId = vendorRow[0].user_id;

    // Delete vendor first, then user
    await db.query("DELETE FROM vendors WHERE id = ?", [id]);
    await db.query("DELETE FROM users WHERE id = ?", [userId]);

    await db.end();

    return NextResponse.json({
      success: true,
      message: "Vendor deleted successfully.",
    });
  } catch (err: any) {
    console.error("❌ DELETE /vendors error:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}
