import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  let db: mysql.Connection | null = null;

  try {
    const {
      id,
      name,
      phone,
      profile_photo,
      address,
      city,
      state,
      country,
      pin_code,
    } = await req.json();

    // ✅ Validate required data
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, message: "❌ Invalid or missing user ID." },
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

    // ✅ Step 1: Update main user info
    const [userUpdate]: any = await db.execute(
      `
      UPDATE users
      SET 
        name = ?, 
        phone = ?, 
        profile_photo = ?, 
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [name || null, phone || null, profile_photo || null, id]
    );

    if (userUpdate.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "⚠️ User not found." },
        { status: 404 }
      );
    }

    // ✅ Step 2: Handle Address (insert or update)
    if (address || city || state || country || pin_code) {
      console.log("📦 Handling address for user:", id);

      const [existing]: any = await db.execute(
        "SELECT id FROM users_addresses WHERE user_id = ? LIMIT 1",
        [id]
      );

      if (existing.length > 0) {
        // 🔁 Update existing record
        await db.execute(
          `
          UPDATE users_addresses
          SET 
            address = ?, 
            city = ?, 
            state = ?, 
            country = ?, 
            pin_code = ?, 
            updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
          `,
          [
            address || null,
            city || null,
            state || null,
            country || null,
            pin_code || null,
            id,
          ]
        );
      } else {
        // 🆕 Insert new address row
        await db.execute(
          `
          INSERT INTO users_addresses
          (user_id, address, city, state, country, pin_code, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())
          `,
          [
            Number(id),
            address || null,
            city || null,
            state || null,
            country || null,
            pin_code || null,
          ]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "✅ Profile and address updated successfully!",
    });
  } catch (error: any) {
    console.error("🚨 Update Profile Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "🚨 Server error while updating profile: " + error.message,
      },
      { status: 500 }
    );
  } finally {
    if (db) await db.end();
  }
}
