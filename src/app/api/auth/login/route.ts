import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";
import bcrypt from "bcryptjs";

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  let db;
  try {
    const { email, password } = (await req.json()) as LoginBody;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // ✅ Connect to MySQL
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // ✅ Check for user by email or username
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1",
      [email, email]
    );

    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password as string);
    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log(`✅ Login success for ${user.username} (${user.role})`);

    // ✅ Determine redirect path based on role
    let redirect = "/welcome";
    if (user.role === "Admin") redirect = "/admin/dashboard";
    else if (user.role === "Vendor") redirect = "/vendor/dashboard";
    else if (user.role === "Technician") redirect = "/technician/dashboard";

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      redirect,
    });
  } catch (error: any) {
    console.error("🚨 Login error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
