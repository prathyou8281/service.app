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
    const { name, email, phone, password, description } = data;

    // Check existing
    const rows = await this.db.query<any[]>('SELECT id FROM vendors WHERE email = ?', [email]);
    if (rows && rows.length > 0) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await this.db.query(
        `INSERT INTO vendors (name, email, phone, password, description, status, is_verified) 
         VALUES (?, ?, ?, ?, ?, 'pending', 0)`,
        [name, email, phone, hashedPassword, description]
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

  async getMetrics(vendorId: number) {
    const [services]: any = await this.db.query('SELECT COUNT(*) as count FROM services WHERE vendor_id = ?', [vendorId]);
    const [technicians]: any = await this.db.query('SELECT COUNT(*) as count FROM technicians WHERE vendor_id = ?', [vendorId]);
    const [bookings]: any = await this.db.query('SELECT COUNT(*) as count FROM services_histories WHERE vendor_id = ? AND status = "pending"', [vendorId]);
    const [earnings]: any = await this.db.query('SELECT SUM(total_amount) as total FROM services_histories WHERE vendor_id = ? AND status = "completed"', [vendorId]);

    return {
      success: true,
      data: {
        services: services.count,
        technicians: technicians.count,
        pendingBookings: bookings.count,
        totalEarnings: earnings.total || 0,
      }
    };
  }

  async updateProfile(id: number, data: any) {
    const { name, phone, description } = data;
    await this.db.query(
      'UPDATE vendors SET name = ?, phone = ?, description = ? WHERE id = ?',
      [name, phone, description, id]
    );
    return { success: true };
  }

  async changePassword(id: number, body: any) {
    const { currentPassword, newPassword } = body;
    const rows: any = await this.db.query('SELECT password FROM vendors WHERE id = ?', [id]);
    if (!rows.length) throw new Error('Vendor not found');

    const isValid = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isValid) throw new Error('Incorrect current password');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.db.query('UPDATE vendors SET password = ? WHERE id = ?', [hashedPassword, id]);
    return { success: true };
  }
}
