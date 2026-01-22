import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { DatabaseService } from "../../database/database.service";

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) {}

  async login(email: string, password: string) {
    if (!email || !password) {
      return { success: false, message: "Email & password required" };
    }

    const rows = await this.db.query<any[]>(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return { success: false, message: "Admin not found" };
    }

    const admin = rows[0];

    if (admin.status !== "active") {
      return { success: false, message: "Admin blocked" };
    }

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return { success: false, message: "Invalid password" };
    }

    return { success: true, admin };
  }
}
