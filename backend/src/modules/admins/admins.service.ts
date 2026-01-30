import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { DatabaseService } from "../../database/database.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) { }

  // --- Profile Management ---
  async getProfile(id: number) {
    const rows = await this.db.query<any[]>("SELECT id, name, email, phone, status FROM admins WHERE id = ?", [id]);
    if (!rows.length) throw new NotFoundException("Admin not found");
    return rows[0];
  }

  async updateProfile(id: number, data: UpdateAdminDto) {
    const fields = [];
    const params = [];

    if (data.name) { fields.push("name = ?"); params.push(data.name); }
    if (data.phone) { fields.push("phone = ?"); params.push(data.phone); }

    if (fields.length === 0) return { message: "No changes detected" };

    params.push(id);
    await this.db.execute(`UPDATE admins SET ${fields.join(", ")} WHERE id = ?`, params);
    return { success: true };
  }

  async getMetrics() {
    const usersCount = await this.db.query<any[]>("SELECT COUNT(*) as count FROM users");
    const vendorsCount = await this.db.query<any[]>("SELECT COUNT(*) as count FROM vendors");
    const pendingVendors = await this.db.query<any[]>("SELECT COUNT(*) as count FROM vendors WHERE status = 'pending'");
    const techniciansCount = await this.db.query<any[]>("SELECT COUNT(*) as count FROM technicians");
    const adminCount = await this.db.query<any[]>("SELECT COUNT(*) as count FROM admins");
    const servicesCount = await this.db.query<any[]>("SELECT COUNT(*) as count FROM services");

    return {
      success: true,
      data: {
        users: usersCount[0]?.count || 0,
        vendors: vendorsCount[0]?.count || 0,
        pending_vendors: pendingVendors[0]?.count || 0,
        technicians: techniciansCount[0]?.count || 0,
        admins: adminCount[0]?.count || 0,
        services: servicesCount[0]?.count || 0,
        service_types: 0 // Mocked or add table
      }
    };
  }

  // --- Admin User Management (Adding Other Admins) ---
  async createAdmin(dto: CreateAdminDto) {
    const existing = await this.db.query<any[]>("SELECT id FROM admins WHERE email = ?", [dto.email]);
    if (existing.length) throw new ConflictException("Email already exists");

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const result = await this.db.execute(
      "INSERT INTO admins (name, email, password, phone, status) VALUES (?, ?, ?, ?, 'active')",
      [dto.name, dto.email, hashedPassword, dto.phone]
    );
    return { id: result.insertId, ...dto, password: undefined };
  }

  async updateStatus(tableName: string, id: number, status: string) {
    // Valid status per prompt: active / inactive / blocked / suspended
    const validStatuses = ['active', 'inactive', 'blocked', 'suspended'];
    if (!validStatuses.includes(status)) throw new BadRequestException("Invalid status");

    const result = await this.db.execute(`UPDATE ${tableName} SET status = ? WHERE id = ?`, [status, id]);
    if (result.affectedRows === 0) throw new NotFoundException(`${tableName} record not found`);
    return { success: true };
  }

  // --- Universal User CRUD (Admins only) ---
  async getAllUsersByRole(role: string) {
    const tableMap = {
      'user': 'users',
      'vendor': 'vendors',
      'technician': 'technicians',
      'admin': 'admins'
    };
    const tableName = tableMap[role];
    if (!tableName) throw new BadRequestException("Invalid role");

    let query = `SELECT id, name, email, phone, status FROM ${tableName}`;
    if (tableName === 'vendors') {
      query = `SELECT id, name, email, phone, status, description, business_type_id FROM vendors`;
    } else if (tableName === 'technicians') {
      query = `SELECT id, name, email, phone, status, vendor_id, skills FROM technicians`;
    }

    const result = await this.db.query<any[]>(query);
    return { success: true, data: result };
  }

  async updateUser(role: string, id: number, data: any) {
    const tableMap = { user: 'users', vendor: 'vendors', technician: 'technicians', admin: 'admins', services: 'services' };
    const tableName = tableMap[role];
    if (!tableName) throw new BadRequestException("Invalid role");

    const fields = [];
    const params = [];

    if (data.name) { fields.push("name = ?"); params.push(data.name); }
    if (data.email) { fields.push("email = ?"); params.push(data.email); }
    if (data.phone) { fields.push("phone = ?"); params.push(data.phone); }
    if (data.status) { fields.push("status = ?"); params.push(data.status); }

    if (tableName === 'vendors') {
      if (data.description) { fields.push("description = ?"); params.push(data.description); }
      if (data.business_type_id) { fields.push("business_type_id = ?"); params.push(data.business_type_id); }
    }

    if (tableName === 'technicians') {
      if (data.skills) { fields.push("skills = ?"); params.push(data.skills); }
      if (data.vendor_id) { fields.push("vendor_id = ?"); params.push(data.vendor_id); }
    }

    if (fields.length === 0) return { message: "No changes detected" };

    params.push(id);
    const result = await this.db.execute(`UPDATE ${tableName} SET ${fields.join(", ")} WHERE id = ?`, params);
    if (result.affectedRows === 0) throw new NotFoundException(`${role} not found`);
    return { success: true };
  }

  async deleteUser(role: string, id: number) {
    const tableMap = { user: 'users', vendor: 'vendors', technician: 'technicians', admin: 'admins', services: 'services' };
    const tableName = tableMap[role];
    if (!tableName) throw new BadRequestException("Invalid role");

    const result = await this.db.execute(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
    if (result.affectedRows === 0) throw new NotFoundException(`${role} not found`);
    return { success: true };
  }

  // --- Oversight ---
  async getAllServices() {
    const result = await this.db.query<any[]>(`
      SELECT s.*, v.name as vendor_name 
      FROM services s 
      JOIN vendors v ON s.vendor_id = v.id
    `);
    return { success: true, data: result };
  }

  async getAllOrders() {
    const result = await this.db.query<any[]>(`
      SELECT h.*, s.name as service_name, v.name as vendor_name, u.name as user_name, t.name as technician_name
      FROM services_histories h
      LEFT JOIN services s ON h.service_id = s.id
      LEFT JOIN vendors v ON h.vendor_id = v.id
      LEFT JOIN users u ON h.user_id = u.id
      LEFT JOIN technicians t ON h.technician_id = t.id
      ORDER BY h.id DESC
    `);
    return { success: true, data: result };
  }

  // --- Notifications ---
  async getNotifications() {
    return this.db.query('SELECT * FROM admin_notifications ORDER BY created_at DESC LIMIT 50');
  }

  async markNotificationRead(id: number) {
    await this.db.execute('UPDATE admin_notifications SET is_read = TRUE WHERE id = ?', [id]);
    return { success: true };
  }
}
