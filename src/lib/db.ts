import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "prathyu8281",  // ✅ your working password
  database: "myapp",
});
