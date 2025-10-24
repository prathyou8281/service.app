// import { NextResponse } from "next/server";
// import mysql, { RowDataPacket, ResultSetHeader } from "mysql2/promise";
// import bcrypt from "bcryptjs";
// import { cookies } from "next/headers"; // Cookie support for session

// // ✅ Registration Request Body interface
// interface RegisterBody {
//   name: string;              // യൂസറിന്റെ പേര് (അനിവാര്യമായത്)
//   email: string;             // യൂസർ ഇമെയിൽ (അനിവാര്യമായത്)
//   password: string;          // പാസ്സ്‌വേഡ് (അനിവാര്യമായത്)
//   phone?: string;            // ഫോൺ നമ്പർ (ഓപ്ഷണൽ)
//   address?: string;          // അഡ്രസ്സ് (ഓപ്ഷണൽ)
//   city?: string;
//   state?: string;
//   country?: string;
//   pin_code?: string;
//   description?: string;      // Vendor short description (ഓപ്ഷണൽ)
//   skills?: string;           // Technician skills (ഓപ്ഷണൽ)
//   profile_photo?: string;    // Profile image URL (ഓപ്ഷണൽ)
// }

// export async function POST(req: Request) {
//   let db: mysql.Connection | null = null;

//   try {
//     // 1️⃣ Request JSON parse ചെയ്യുക
//     const body = (await req.json()) as RegisterBody;
//     const {
//       name,
//       email,
//       password,
//       phone,
//       address,
//       city,
//       state,
//       country,
//       pin_code,
//       description,
//       skills,
//       profile_photo,
//     } = body;

//     // 2️⃣ അനിവാര്യ ഫീൽഡുകൾ validate ചെയ്യുക
//     if (!name || !email || !password) {
//       return NextResponse.json(
//         { success: false, message: "Name, Email, and Password are required." },
//         { status: 400 }
//       );
//     }

//     // 3️⃣ Password hash ചെയ്യുക (bcrypt)
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 4️⃣ DB-യുമായി കണക്ട് ചെയ്യുക
//     db = await mysql.createConnection({
//       host: process.env.DB_HOST,
//       port: Number(process.env.DB_PORT),
//       user: process.env.DB_USER,
//       password: process.env.DB_PASS,
//       database: process.env.DB_NAME,
//     });

//     // 5️⃣ Email duplicate check across all main tables
//     const [exists] = await db.query<RowDataPacket[]>(
//       `SELECT email FROM users WHERE email=? 
//        UNION SELECT email FROM vendors WHERE email=? 
//        UNION SELECT email FROM technicians WHERE email=?`,
//       [email, email, email]
//     );

//     if (exists.length > 0) {
//       return NextResponse.json(
//         { success: false, message: "Email already registered." },
//         { status: 409 }
//       );
//     }

//     // 6️⃣ Begin transaction
//     await db.beginTransaction();

//     // 7️⃣ Insert into users table
//     const [userResult] = await db.query<ResultSetHeader>(
//       `INSERT INTO users 
//        (name, email, password, phone, profile_photo, status, created_at, updated_at)
//        VALUES (?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
//       [name, email, hashedPassword, phone || null, profile_photo || null]
//     );

//     const userId = userResult.insertId; // യൂസർ ID സേവ് ചെയ്യുന്നു

//     // 8️⃣ Insert into users_addresses table if address provided
//     if (address || city || state || country || pin_code) {
//       await db.query(
//         `INSERT INTO users_addresses 
//          (user_id, address, city, state, country, pin_code, status, created_at, updated_at)
//          VALUES (?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
//         [userId, address || "", city || "", state || "", country || "", pin_code || ""]
//       );
//     }

//     // 9️⃣ Optional: Insert into vendors table if description exists
//     if (description) {
//       await db.query(
//         `INSERT INTO vendors 
//          (name, email, password, phone, description, profile_photo, status, created_at, updated_at)
//          VALUES (?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
//         [name, email, hashedPassword, phone || null, description, profile_photo || null]
//       );
//     }

//     // 🔟 Optional: Insert into technicians table if skills exist
//     if (skills) {
//       await db.query(
//         `INSERT INTO technicians 
//          (name, email, password, phone, skills, profile_photo, status, created_at, updated_at)
//          VALUES (?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
//         [name, email, hashedPassword, phone || null, skills, profile_photo || null]
//       );
//     }

//     // 1️⃣1️⃣ Commit transaction
//     await db.commit();

//     // 1️⃣2️⃣ Set user_id in HTTP-only cookie for session
//     const nextCookies = cookies();
//     nextCookies.set({
//       name: "user_id",
//       value: String(userId),
//       httpOnly: true,
//       path: "/",
//       maxAge: 60 * 60 * 24, // 1 day
//     });

//     // 1️⃣3️⃣ Success response
//     return NextResponse.json({
//       success: true,
//       message: "Registration successful",
//       user_id: userId,
//     });

//   } catch (err: any) {
//     // ❌ Error handling & rollback
//     if (db) await db.rollback();
//     console.error("Registration Error:", err.message);
//     return NextResponse.json({ success: false, message: err.message }, { status: 500 });

//   } finally {
//     // 🔚 Close DB connection
//     if (db) await db.end();
//   }
// }
