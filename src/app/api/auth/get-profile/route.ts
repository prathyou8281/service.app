import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  role?: string;
  created_at?: string;
}

export async function GET(req: Request) {
  let db: mysql.Connection | null = null;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing user ID" },
        { status: 400 }
      );
    }

    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows] = await db.execute<UserRow[]>(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const user = rows[0];

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone ?? "",
        address: user.address ?? "",
        role: user.role ?? "Member",
        joined: user.created_at
          ? new Date(user.created_at).toLocaleDateString()
          : "N/A",
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("🚨 Get Profile Error:", error.message);
    } else {
      console.error("🚨 Unknown Error in Get Profile:", error);
    }
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
