import mysql from "mysql2/promise";

// ✅ Create a reusable connection pool for MySQL (XAMPP MariaDB)
export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "prathyu8281", // your working password
  database: "serviceapp",  // your database name
  port: 3307,              // ✅ important: matches XAMPP MySQL port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
