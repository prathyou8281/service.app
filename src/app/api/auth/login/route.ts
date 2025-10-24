import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";
import bcrypt from "bcryptjs";

interface LoginBody {
  email: string;
  password: string;
}

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  profile_photo?: string;
  status?: string;
}

export async function POST(req: Request) {
  let db: mysql.Connection | null = null;

  try {
    const { email, password } = (await req.json()) as LoginBody;

    // 🟡 Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    // ✅ Connect to Database
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // 🔍 Find user by email or phone
    const [rows] = await db.execute<UserRow[]>(
      "SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1",
      [email, email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const user = rows[0];

    // 🔐 Check account status
    if (user.status && user.status.toLowerCase() !== "active") {
      return NextResponse.json(
        { success: false, message: "Your account is not active." },
        { status: 403 }
      );
    }

    // 🔑 Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // ✅ Success — clean sensitive data
    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: safeUser.id,
        name: safeUser.name,
        email: safeUser.email,
        phone: safeUser.phone,
        profile_photo: safeUser.profile_photo || null,
        status: safeUser.status,
      },
      redirect: "/welcome",
    });
  } catch (error) {
    console.error("🚨 Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
