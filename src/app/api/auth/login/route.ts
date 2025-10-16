import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";
import bcrypt from "bcryptjs";

interface LoginBody {
  email: string;
  password: string;
}

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

export async function POST(req: Request) {
  let db: mysql.Connection | null = null;

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
    const [rows] = await db.execute<UserRow[]>(
      "SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1",
      [email, email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log(`✅ Login success for ${user.username} (${user.role})`);

    // ✅ Role-based redirect logic
    let redirect = "/welcome";
    switch (user.role?.toLowerCase()) {
      case "admin":
        redirect = "/admin/dashboard";
        break;
      case "vendor":
        redirect = "/vendor/dashboard";
        break;
      case "technician":
        redirect = "/technician/dashboard";
        break;
      default:
        redirect = "/welcome";
        break;
    }

    // ✅ Return response
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("🚨 Login error:", error.message);
    } else {
      console.error("🚨 Login error: Unknown error", error);
    }

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
