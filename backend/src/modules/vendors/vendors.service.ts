import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class VendorsService {
  constructor(private readonly db: DatabaseService) { }

  // --- Profile ---
  async getProfile(id: number) {
    const rows = await this.db.query<any[]>('SELECT id, name, email, phone, status, description, avatar FROM vendors WHERE id = ?', [id]);
    if (!rows.length) throw new NotFoundException('Vendor not found');
    return rows[0];
  }

  async updateProfile(id: number, data: any) {
    const fields = [];
    const params = [];

    if (data.name) { fields.push('name = ?'); params.push(data.name); }
    if (data.phone) { fields.push('phone = ?'); params.push(data.phone); }
    if (data.description) { fields.push('description = ?'); params.push(data.description); }
    if (data.avatar) { fields.push('avatar = ?'); params.push(data.avatar); }

    if (fields.length === 0) return { success: true };

    params.push(id);
    await this.db.execute(`UPDATE vendors SET ${fields.join(', ')} WHERE id = ?`, params);
    return { success: true };
  }

  // --- Technician Management ---
  async createTechnician(vendorId: number, data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const result = await this.db.execute(
      `INSERT INTO technicians (name, email, phone, password, vendor_id, status) 
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [data.name, data.email, data.phone, hashedPassword, vendorId]
    );
    return { id: result.insertId, ...data, password: undefined };
  }

  async getMyTechnicians(vendorId: number) {
    return this.db.query('SELECT id, name, email, phone, status FROM technicians WHERE vendor_id = ?', [vendorId]);
  }

  async updateTechnicianStatus(vendorId: number, technicianId: number, status: string) {
    const result = await this.db.execute(
      'UPDATE technicians SET status = ? WHERE id = ? AND vendor_id = ?',
      [status, technicianId, vendorId]
    );
    if (result.affectedRows === 0) throw new NotFoundException('Technician not found or unauthorized');
    return { success: true };
  }

  async approveTechnician(vendorId: number, technicianId: number) {
    return this.updateTechnicianStatus(vendorId, technicianId, 'active');
  }

  async rejectTechnician(vendorId: number, technicianId: number) {
    return this.updateTechnicianStatus(vendorId, technicianId, 'rejected');
  }

  // --- Service Management ---
  async createService(vendorId: number, data: any) {
    const shortDesc = data.short_description || (data.description ? data.description.substring(0, 100) : null);
    const result = await this.db.execute(
      `INSERT INTO services (vendor_id, service_type_id, name, short_description, description, price, image, video, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [vendorId, data.service_type_id, data.name, shortDesc, data.description, data.price, data.image || null, data.video || null]
    );
    return { id: result.insertId, ...data };
  }

  async getMyServices(vendorId: number) {
    return this.db.query('SELECT * FROM services WHERE vendor_id = ?', [vendorId]);
  }

  // --- Service Request Management ---
  async getServiceRequests(vendorId: number) {
    return this.db.query(
      `SELECT h.*, s.name as service_name, u.name as user_name, t.name as technician_name
       FROM services_histories h
       JOIN services s ON h.service_id = s.id
       JOIN users u ON h.user_id = u.id
       LEFT JOIN technicians t ON h.technician_id = t.id
       WHERE h.vendor_id = ?`,
      [vendorId]
    );
  }

  async assignTechnician(vendorId: number, historyId: number, technicianId: number) {
    // Verify technician belongs to this vendor
    const tech = await this.db.query<any[]>('SELECT id FROM technicians WHERE id = ? AND vendor_id = ?', [technicianId, vendorId]);
    if (!tech.length) throw new ForbiddenException('Technician does not belong to this vendor');

    const result = await this.db.execute(
      'UPDATE services_histories SET technician_id = ?, status = "assigned" WHERE id = ? AND vendor_id = ?',
      [technicianId, historyId, vendorId]
    );

    if (result.affectedRows === 0) throw new NotFoundException('Service request not found or unauthorized');
    return { success: true };
  }

  // --- Business Types ---
  async getBusinessTypes() {
    return this.db.query('SELECT * FROM business_types');
  }

  async getStats(vendorId: number) {
    const revenueRows = await this.db.query<any[]>('SELECT SUM(price) as total FROM services_histories h JOIN services s ON h.service_id = s.id WHERE h.vendor_id = ? AND h.status = "completed"', [vendorId]);
    const activeJobsRows = await this.db.query<any[]>('SELECT COUNT(*) as count FROM services_histories WHERE vendor_id = ? AND status IN ("pending", "assigned", "processing", "out_for_delivery")', [vendorId]);
    const servicesRows = await this.db.query<any[]>('SELECT COUNT(*) as count FROM services WHERE vendor_id = ?', [vendorId]);

    return {
      revenue: revenueRows[0]?.total || 0,
      activeJobs: activeJobsRows[0]?.count || 0,
      totalServices: servicesRows[0]?.count || 0,
      rating: 4.8 // Mocked for now
    };
  }

  // --- External Registration ---
  async register(data: any) {
    const existing = await this.db.query<any[]>('SELECT id FROM vendors WHERE email = ?', [data.email]);
    if (existing.length > 0) return { success: false, message: 'Email already registered' };

    let businessTypeId = data.business_type_id;

    // Handle NEW business type
    if (data.new_business_type) {
      const btResult = await this.db.execute('INSERT INTO business_types (name) VALUES (?)', [data.new_business_type]);
      businessTypeId = btResult.insertId;

      // Add Admin Notification for NEW Business Type
      await this.db.execute(
        `INSERT INTO admin_notifications (type, title, message, payload) 
         VALUES ('new_business_type', 'New Business Type Added', ?, ?)`,
        [`Merchant ${data.name} added a new category: ${data.new_business_type}`, JSON.stringify({ name: data.new_business_type, merchant: data.name })]
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const result = await this.db.execute(
      `INSERT INTO vendors (name, email, phone, password, description, business_type_id, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [data.name, data.email, data.phone, hashedPassword, data.description || 'Verified Merchant', businessTypeId]
    );

    // Add Admin Notification for New Merchant Registration
    await this.db.execute(
      `INSERT INTO admin_notifications (type, title, message, payload) 
       VALUES ('new_merchant', 'Merchant Registration Detected', ?, ?)`,
      [`New registration from ${data.name}. Manual verification protocol required.`, JSON.stringify({ vendorId: result.insertId, name: data.name, email: data.email })]
    );

    return { success: true, vendorId: result.insertId };
  }
}
