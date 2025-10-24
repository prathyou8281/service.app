    import { NextResponse } from "next/server";
import mysql, { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import bcrypt from "bcryptjs";

interface VendorRegisterBody {
  name: string;
  email: string;
  password: string;
  phone?: string;
  description?: string;
  profile_photo?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pin_code?: string;
}

export async function POST(req: Request) {
  let db: mysql.Connection | null = null;
  try {
    const body = (await req.json()) as VendorRegisterBody;
    const { name, email, password, phone, description, profile_photo, address, city, state, country, pin_code } = body;

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

    const [exists] = await db.query<RowDataPacket[]>(`SELECT email FROM vendors WHERE email=?`, [email]);
    if (exists.length > 0)
      return NextResponse.json({ success: false, message: "Email already registered." }, { status: 409 });

    await db.beginTransaction();

    const [vendorResult] = await db.query<ResultSetHeader>(
      `INSERT INTO vendors (name, email, password, phone, description, profile_photo, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
      [name, email, hashedPassword, phone || null, description || null, profile_photo || null]
    );

    const vendorId = vendorResult.insertId;

    if (address || city || state || country || pin_code) {
      await db.query(
        `INSERT INTO vendors_addresses (vendor_id, address, city, state, country, pin_code, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
        [vendorId, address || "", city || "", state || "", country || "", pin_code || ""]
      );
    }

    await db.commit();

    return NextResponse.json({ success: true, message: "Vendor registration successful", vendor_id: vendorId });

  } catch (err: any) {
    if (db) await db.rollback();
    console.error("Vendor Registration Error:", err.message);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  } finally {
    if (db) await db.end();
  }
}
