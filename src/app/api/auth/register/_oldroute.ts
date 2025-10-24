import { NextResponse } from "next/server";
import mysql, { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import bcrypt from "bcryptjs";

interface RegisterBody {
  username: string;
  email: string;
  password: string;
  role: "User" | "Vendor" | "Technician";
  phone?: string;
  address?: string;
  shopName?: string;
  shopLocation?: string;
  serviceType?: string;
  experience?: string;
  skill?: string;
  availability?: string;
}

export async function POST(req: Request) {
  let db: mysql.Connection | null = null;

  try {
    const body = (await req.json()) as RegisterBody;
    const {
      username,
      email,
      password,
      role,
      phone,
      address,
      shopName,
      shopLocation,
      serviceType,
      experience,
      skill,
      availability,
    } = body;

    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "All fields and role are required." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Connect Database
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });


    // Prevent duplicates across all tables
    const [exists] = await db.query<RowDataPacket[]>(
      `SELECT email FROM users WHERE email=? 
       UNION SELECT email FROM vendors WHERE email=? 
       UNION SELECT email FROM technicians WHERE email=?`,
      [email, email, email]
    );

    if (exists.length > 0) {
      return NextResponse.json(
        { success: false, message: "Email already registered." },
        { status: 409 }
      );
    }

    // ✅ Begin Transaction
    await db.beginTransaction();

    // 1️⃣ Insert into USERS table (base)
    const [userResult] = await db.query<ResultSetHeader>(
      `INSERT INTO users 
       (username, email, password, created_at, phone, address, shopName, shopLocation, skill, experience, profilePhoto)
       VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, NULL)`,
      [
        username,
        email,
        hashedPassword,
        phone || null,
        address || null,
        shopName || null,
        shopLocation || null,
        skill || null,
        experience || null,
      ]
    );

    const userId = userResult.insertId;

    // 2️⃣ Insert into VENDORS or TECHNICIANS table
    if (role === "Vendor") {
      await db.query(
        `INSERT INTO vendors 
         (username, user_id, shopName, shopLocation, serviceType, experience, phone, email, password, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          username,
          userId,
          shopName || username,
          shopLocation || null,
          serviceType || null,
          experience || null,
          phone || null,
          email,
          hashedPassword,
        ]
      );
    }

    if (role === "Technician") {
      await db.query(
        `INSERT INTO technicians 
         (username, user_id, fullName, skill, experience, availability, phone, email, password, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          username,
          userId,
          username, // fullName same as username
          skill || null,
          experience || null,
          availability || "available",
          phone || null,
          email,
          hashedPassword,
        ]
      );
    }

    await db.commit();

    return NextResponse.json({
      success: true,
      message: `${role} registration successful.`,
    });
  } catch (err: any) {
    if (db) await db.rollback();
    console.error("Registration Error:", err.message);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
