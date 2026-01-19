import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class VendorsService {
  constructor(private readonly db: DatabaseService) {}

  async login(email: string, password: string) {
    // 1️⃣ Basic validation
    if (!email || !password) {
      return { success: false, message: 'Email and password required' };
    }

    // 2️⃣ Get vendor by email
    const rows = await this.db.query<any[]>(
      'SELECT * FROM vendors WHERE email = ?',
      [email]
    );

    if (!rows || rows.length === 0) {
      return { success: false, message: 'Vendor not found' };
    }

    const vendor = rows[0];

    // 3️⃣ Status check
    if (vendor.status !== 'active') {
      return { success: false, message: 'Vendor account blocked' };
    }

    // 4️⃣ Password check
    const isValid = await bcrypt.compare(password, vendor.password);
    if (!isValid) {
      return { success: false, message: 'Invalid password' };
    }

    // 5️⃣ Success
    return {
      success: true,
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
      },
    };
  }
}
