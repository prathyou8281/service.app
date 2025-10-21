import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";
import bcrypt from "bcryptjs";

interface LoginBody {
  email: string;
  password: string;
}

interface GenericUser extends RowDataPacket {
  id: number;
  username?: string;
  fullName?: string;
  shopName?: string;
  email: string;
  password: string;
  role?: string;
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

    // ✅ Connect to DB
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    let user: GenericUser | null = null;
    let role: string = "";
    let redirect: string = "";

    // 1️⃣ Check Admins table
    const [admins] = await db.execute<GenericUser[]>(
      "SELECT * FROM admins WHERE email = ? LIMIT 1",
      [email]
    );
    if (admins.length > 0) {
      const admin = admins[0];
      const isValid = await bcrypt.compare(password, admin.password);
      if (isValid) {
        user = admin;
        role = "Admin";
        redirect = "/admin/dashboard";
      }
    }

    // 2️⃣ Check Vendors table
    if (!user) {
      const [vendors] = await db.execute<GenericUser[]>(
        "SELECT * FROM vendors WHERE email = ? LIMIT 1",
        [email]
      );
      if (vendors.length > 0) {
        const vendor = vendors[0];
        const isValid = await bcrypt.compare(password, vendor.password);
        if (isValid) {
          user = vendor;
          role = "Vendor";
          redirect = "/vendor/dashboard";
        }
      }
    }

    // 3️⃣ Check Technicians table
    if (!user) {
      const [technicians] = await db.execute<GenericUser[]>(
        "SELECT * FROM technicians WHERE email = ? LIMIT 1",
        [email]
      );
      if (technicians.length > 0) {
        const tech = technicians[0];
        const isValid = await bcrypt.compare(password, tech.password);
        if (isValid) {
          user = tech;
          role = "Technician";
          redirect = "/technician/dashboard";
        }
      }
    }

    // 4️⃣ Check Users table
    if (!user) {
      const [users] = await db.execute<GenericUser[]>(
        "SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1",
        [email, email]
      );
      if (users.length > 0) {
        const usr = users[0];
        const isValid = await bcrypt.compare(password, usr.password);
        if (isValid) {
          user = usr;
          role = usr.role || "User";
          redirect = "/welcome";
        }
      }
    }

    // ❌ If no match found
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log(`✅ Login success for ${email} (${role})`);

    // ✅ Return success
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username || user.fullName || user.shopName || "User",
        email: user.email,
        role,
      },
      redirect,
    });
  } catch (error: unknown) {
    console.error("🚨 Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
