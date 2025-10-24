import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

/* ---------------------- DATABASE CONNECTION ---------------------- */
async function connectDB() {
  const db = await mysql.createConnection({
     host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
  });
  return db;
}

/* ---------------------- GET USERS ---------------------- */
export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM users ORDER BY id DESC");
    await db.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}

/* ---------------------- ADD USER ---------------------- */
export async function POST(req: Request) {
  try {
  const { username, email, password, phone, address } = await req.json();

let missingFields = [];
if (!username) missingFields.push("username");
if (!email) missingFields.push("email");
if (!password) missingFields.push("password");
if (!phone) missingFields.push("phone");
if (!address) missingFields.push("address");

if (missingFields.length > 0) {
  return NextResponse.json({
    success: false,
    message: `Missing required field(s): ${missingFields.join(", ")}`,
  });
}


    const db = await connectDB();

    // Check duplicate email
    const [exists]: any = await db.query("SELECT id FROM users WHERE email=?", [email]);
    if (exists.length > 0) {
      await db.end();
      return NextResponse.json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const plainPassword = password || "12345"; // default if not provided
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const [result]: any = await db.query(
      `INSERT INTO users (username, email, password, phone, address)
       VALUES (?,  ?, ?, ?, ?)`,
      [username, email, hashedPassword, phone || null, address || null]
    );
    await db.end();
    return NextResponse.json({
      success: true,
      message: "User added successfully",
      id: result.insertId,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}

/* ---------------------- UPDATE USER ---------------------- */
export async function PUT(req: Request) {
  try {
    const { id, username, email, phone, address } = await req.json();
    if (!id) return NextResponse.json({ success: false, message: "User ID required" });

    const db = await connectDB();
    await db.query(
      "UPDATE users SET username=?, email=?, phone=?, address=? WHERE id=?",
      [username, email,  phone, address, id]
    );
    await db.end();
    return NextResponse.json({ success: true, message: "User updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}

/* ---------------------- DELETE USER ---------------------- */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Missing ID" });

    const db = await connectDB();
    await db.query("DELETE FROM users WHERE id=?", [id]);
    await db.end();
    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
