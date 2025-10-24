import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

// 🧱 Define user interface
interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile_photo: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

// 🧩 Shared MySQL connection pool (better for performance)
let pool: mysql.Pool | null = null;

function getDB() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectionLimit: 10, // ✅ reuse connections
    });
  }
  return pool;
}

// 🚀 API Route Handler
export async function GET(req: Request) {
  const db = getDB();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing user ID." },
        { status: 400 }
      );
    }

    // ✅ Fetch user from DB
    const [rows] = await db.execute<UserRow[]>(
      `
      SELECT 
        id,
        name,
        email,
        phone,
        profile_photo,
        status,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const user = rows[0];

    // 🧠 Format data
    const displayName = user.name?.trim() || "User";
    const joinedDate = user.created_at
      ? new Date(user.created_at).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

    const avatar =
      user.profile_photo && user.profile_photo.trim() !== ""
        ? user.profile_photo
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            displayName
          )}&background=00bcd4&color=ffffff&bold=true&size=128`;

    // ✅ Clean response
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: displayName,
        email: user.email,
        phone: user.phone || "",
        status: user.status || "active",
        profilePhoto: avatar,
        joined: joinedDate,
      },
    });
  } catch (error: unknown) {
    console.error("🚨 Get Profile Error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json(
      { success: false, message: "Server error: " + message },
      { status: 500 }
    );
  }
}
