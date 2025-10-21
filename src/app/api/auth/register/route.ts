import { NextResponse } from "next/server";
import mysql, { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import bcrypt from "bcryptjs";

interface RegisterBody {
  username: string;
  email: string;
  password: string;
  role: "Admin" | "Technician" | "Vendor" | string;
  phone?: string;
  // Vendor
  shopName?: string;
  shopLocation?: string;
  serviceType?: string;
  experience?: string;
  // Technician
  skill?: string;
  availability?: string;
}

interface SimpleRow extends RowDataPacket {
  id: number;
}

export async function POST(req: Request) {
  let db: mysql.Connection | null = null;

  try {
    const {
      username,
      email,
      password,
      role,
      phone,
      shopName,
      shopLocation,
      serviceType,
      experience,
      skill,
      availability,
    } = (await req.json()) as RegisterBody;

    // Basic validation
    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "All fields and role are required." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Connect DB
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      multipleStatements: false,
    });

    // ---------- ADMIN (no user_id) ----------
    if (role === "Admin") {
      // dedupe
      const [exists] = await db.execute<SimpleRow[]>(
        "SELECT id FROM admins WHERE email = ? OR username = ? LIMIT 1",
        [email, username]
      );
      if (exists.length) {
        return NextResponse.json(
          { success: false, message: "Admin already exists." },
          { status: 409 }
        );
      }

      await db.execute(
        "INSERT INTO admins (username, email, password, phone, created_at) VALUES (?, ?, ?, ?, NOW())",
        [username, email, hashedPassword, phone || null]
      );

      // OPTIONAL: also create a base users row for admins
      // const [ur] = await db.execute<ResultSetHeader>(
      //   "INSERT INTO users (username, email, password, role, phone, created_at) VALUES (?, ?, ?, 'Admin', ?, NOW())",
      //   [username, email, hashedPassword, phone || null]
      // );

      return NextResponse.json({
        success: true,
        message: "Admin registration successful.",
      });
    }

    // ---------- Start transaction for Vendor/Technician (needs user_id) ----------
    await db.beginTransaction();

    // Dedupe email in users to avoid duplicates across roles
    const [userExists] = await db.execute<SimpleRow[]>(
      "SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1",
      [email, username]
    );
    if (userExists.length) {
      await db.rollback();
      return NextResponse.json(
        { success: false, message: "User already exists." },
        { status: 409 }
      );
    }

    // 1) Create base users row
    const [userRes] = await db.execute<ResultSetHeader>(
      "INSERT INTO users (username, email, password, role, phone, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [username, email, hashedPassword, role, phone || null]
    );
    const userId = (userRes as ResultSetHeader).insertId;

    // 2) Role-specific insert
    if (role === "Technician") {
      // also dedupe in technicians by email/fullName if you want a safety check
      const [tExists] = await db.execute<SimpleRow[]>(
        "SELECT id FROM technicians WHERE email = ? LIMIT 1",
        [email]
      );
      if (tExists.length) {
        await db.rollback();
        return NextResponse.json(
          { success: false, message: "Technician already exists." },
          { status: 409 }
        );
      }

      await db.execute(
        `INSERT INTO technicians
          (user_id, fullName, skill, experience, availability, phone, email, password, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          userId,
          username,                 // fullName
          skill || null,
          experience || null,
          availability || "Available",
          phone || null,
          email,
          hashedPassword,
        ]
      );

      await db.commit();
      return NextResponse.json({
        success: true,
        message: "Technician registration successful.",
      });
    }

    if (role === "Vendor") {
      const [vExists] = await db.execute<SimpleRow[]>(
        "SELECT id FROM vendors WHERE email = ? LIMIT 1",
        [email]
      );
      if (vExists.length) {
        await db.rollback();
        return NextResponse.json(
          { success: false, message: "Vendor already exists." },
          { status: 409 }
        );
      }

      await db.execute(
        `INSERT INTO vendors
          (user_id, shopName, shopLocation, serviceType, experience, phone, email, password, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          userId,
          shopName || username || null, // fall back to username if you prefer
          shopLocation || null,
          serviceType || null,
          experience || null,
          phone || null,
          email,
          hashedPassword,
        ]
      );

      await db.commit();
      return NextResponse.json({
        success: true,
        message: "Vendor registration successful.",
      });
    }

    // If some other role slipped through, just keep the base users record
    await db.commit();
    return NextResponse.json({
      success: true,
      message: "User registration successful.",
    });
  } catch (error: any) {
    // Roll back if a transaction was open
    try { if (db) await db.rollback(); } catch {}
    console.error("🚨 Registration Error:", error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || "Server error." },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
