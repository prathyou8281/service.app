import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";
import bcrypt from "bcryptjs";

// ✅ Define expected input structure
interface RegisterBody {
  username: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export async function POST(req: Request) {
  try {
    const { username, email, password, phone, address } = (await req.json()) as RegisterBody;

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // ✅ Properly type the result
    const [existing] = await db.execute<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    await db.execute(
      "INSERT INTO users (username, email, password, phone, address) VALUES (?, ?, ?, ?, ?)",
      [username, email, hashedPassword, phone || null, address || null]
    );

    return NextResponse.json({
      success: true,
      message: "Registration successful",
    });
  } catch (error: unknown) {
    // ✅ Safely handle errors
    if (error instanceof Error) {
      console.error("Register Error:", error.message);
    } else {
      console.error("Unknown register error:", error);
    }

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
