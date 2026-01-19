import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../../database/database.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class VendorsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService
  ) { }

  async register(data: any): Promise<void> {
    const { name, email, phone, password, address } = data; // Assuming address is simple string for now or handled separately

    // Check existing
    const rows = await this.db.query<any[]>('SELECT id FROM vendors WHERE email = ?', [email]);
    if (rows && rows.length > 0) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await this.db.query(
        `INSERT INTO vendors (name, email, phone, password, status) 
         VALUES (?, ?, ?, ?, 'active')`,
        [name, email, phone, hashedPassword]
      );
    } catch (error) {
      console.error(error);
      throw new Error('Registration failed');
    }
  }

  async login(email: string, password: string) {
    if (!email || !password) return { success: false, message: 'Email and password required' };

    const rows = await this.db.query<any[]>('SELECT * FROM vendors WHERE email = ?', [email]);
    if (!rows || rows.length === 0) return { success: false, message: 'Vendor not found' };

    const vendor = rows[0];
    if (vendor.status !== 'active') return { success: false, message: 'Vendor account blocked' };

    const isValid = await bcrypt.compare(password, vendor.password);
    if (!isValid) return { success: false, message: 'Invalid password' };

    const payload = { sub: vendor.id, email: vendor.email, role: 'vendor' };

    return {
      success: true,
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        access_token: this.jwtService.sign(payload),
      },
    };
  }

  async getProfile(id: number) {
    const rows = await this.db.query<any[]>('SELECT * FROM vendors WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return null;
    const { password, ...result } = rows[0];
    return result;
  }
}
