import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

/* -----------------------------------------
   ✅ MySQL Connection
------------------------------------------ */
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
   🔹 GET — Fetch all users
------------------------------------------ */
export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM users ORDER BY id DESC");
    await db.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (err: any) {
    console.error("GET /users error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}

/* -----------------------------------------
   🔹 POST — Add New User
------------------------------------------ */
export async function POST(req: Request) {
  try {
    const { username, email, password, role, phone, address } = await req.json();

    if (!username || !email || !password || !role) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const db = await connectDB();

    // Check for duplicates
    const [exists]: any = await db.query(
      "SELECT id FROM users WHERE email=?",
      [email]
    );
    if (exists.length > 0) {
      await db.end();
      return NextResponse.json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // ✅ Default bcrypt-hashed password for simplicity (12345)
    const defaultHash =
      "$2b$10$O5z2UqH.XrVPlYJFrQkD8uhyOjxCv3.HZCnEfDR7E5pJmN6N7Pmqi";

    const [result]: any = await db.query(
      `INSERT INTO users (username, email, password, role, phone, address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, defaultHash, role, phone || null, address || null]
    );

    await db.end();
    return NextResponse.json({
      success: true,
      message: "User added successfully",
      userId: result.insertId,
    });
  } catch (err: any) {
    console.error("POST /users error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}

/* -----------------------------------------
   🔹 PUT — Update User
------------------------------------------ */
export async function PUT(req: Request) {
  try {
    const {
      id,
      username,
      email,
      role,
      phone,
      address,
      shopName,
      shopLocation,
      skill,
      experience,
    } = await req.json();

    if (!id)
      return NextResponse.json({ success: false, message: "Missing user ID" });

    const db = await connectDB();
    await db.query(
      `UPDATE users SET username=?, email=?, role=?, phone=?, address=?, shopName=?, shopLocation=?, skill=?, experience=? WHERE id=?`,
      [
        username,
        email,
        role,
        phone,
        address,
        shopName,
        shopLocation,
        skill,
        experience,
        id,
      ]
    );

    await db.end();
    return NextResponse.json({ success: true, message: "User updated" });
  } catch (err: any) {
    console.error("PUT /users error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}

/* -----------------------------------------
   🔹 DELETE — Remove User
------------------------------------------ */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ success: false, message: "Missing user ID" });

    const db = await connectDB();
    await db.query("DELETE FROM users WHERE id=?", [id]);
    await db.end();

    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (err: any) {
    console.error("DELETE /users error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
