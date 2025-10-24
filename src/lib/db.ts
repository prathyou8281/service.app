import mysql from "mysql2/promise";

// ✅ Create a reusable connection pool for MySQL (XAMPP MariaDB)
export const db = mysql.createPool({
  host: "localhost",
     port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
   
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


 