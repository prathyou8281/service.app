import { NextResponse } from "next/server";
import mysql, { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

interface UserRegisterBody {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pin_code?: string;
  profile_photo?: string;
}

export async function POST(req: Request) {
  let db: mysql.Connection | null = null;
  try {
    const body = (await req.json()) as UserRegisterBody;
    const { name, email, password, phone, address, city, state, country, pin_code, profile_photo } = body;

    if (!name || !email || !password)
      return NextResponse.json({ success: false, message: "Name, Email, and Password are required." }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Duplicate check
    const [exists] = await db.query<RowDataPacket[]>(`SELECT email FROM users WHERE email=?`, [email]);
    if (exists.length > 0)
      return NextResponse.json({ success: false, message: "Email already registered." }, { status: 409 });

    await db.beginTransaction();

    const [userResult] = await db.query<ResultSetHeader>(
      `INSERT INTO users (name, email, password, phone, profile_photo, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
      [name, email, hashedPassword, phone || null, profile_photo || null]
    );

    const userId = userResult.insertId;

    if (address || city || state || country || pin_code) {
      await db.query(
        `INSERT INTO users_addresses (user_id, address, city, state, country, pin_code, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
        [userId, address || "", city || "", state || "", country || "", pin_code || ""]
      );
    }

    await db.commit();

    const nextCookies = cookies();
    (await nextCookies).set({
      name: "user_id",
      value: String(userId),
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ success: true, message: "User registration successful", user_id: userId });

  } catch (err: any) {
    if (db) await db.rollback();
    console.error("User Registration Error:", err.message);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  } finally {
    if (db) await db.end();
  }
}
