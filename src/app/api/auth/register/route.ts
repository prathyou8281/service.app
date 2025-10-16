import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";
import bcrypt from "bcryptjs";

interface RegisterBody {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  email: string;
}

export async function POST(req: Request) {
  let db: mysql.Connection | null = null;

  try {
    const { username, email, password, role } = (await req.json()) as RegisterBody;

    // ✅ Validate input
    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "All fields and role are required." },
        { status: 400 }
      );
    }

    // ✅ Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Connect to MySQL
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // ✅ Check for existing user
    const [existing] = await db.execute<UserRow[]>(
      "SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1",
      [email, username]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "User already exists." },
        { status: 409 }
      );
    }

    // ✅ Insert user with selected role
    await db.execute(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, role]
    );

    return NextResponse.json({
      success: true,
      message: "Registration successful.",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("🚨 Registration Error:", error.message);
    } else {
      console.error("🚨 Unknown Registration Error:", error);
    }

    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
