import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) { }

  async getProfile(id: number) {
    const rows = await this.db.query<any[]>(
      'SELECT id, name, email, phone, status, avatar FROM users WHERE id = ?',
      [id]
    );
    if (!rows.length) throw new NotFoundException('User not found');
    return rows[0];
  }

  async updateProfile(id: number, data: any) {
    const fields = [];
    const params = [];

    if (data.name) { fields.push('name = ?'); params.push(data.name); }
    if (data.phone) { fields.push('phone = ?'); params.push(data.phone); }
    if (data.avatar) { fields.push('avatar = ?'); params.push(data.avatar); }

    if (fields.length === 0) return { message: 'No changes detected' };

    params.push(id);
    await this.db.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
    return { success: true };
  }

  // --- Service Interaction ---
  async requestService(userId: number, data: any) {
    // data: { service_id, vendor_id, user_description, total_amount }
    const result = await this.db.execute(
      `INSERT INTO services_histories (user_id, service_id, vendor_id, user_description, total_amount, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [userId, data.service_id, data.vendor_id, data.user_description, data.total_amount]
    );
    return { success: true, historyId: result.insertId };
  }

  async getMyHistory(userId: number) {
    return this.db.query(
      `SELECT h.*, s.name as service_name, v.name as vendor_name, t.name as technician_name 
       FROM services_histories h
       JOIN services s ON h.service_id = s.id
       JOIN vendors v ON h.vendor_id = v.id
       LEFT JOIN technicians t ON h.technician_id = t.id
       WHERE h.user_id = ? 
       ORDER BY h.id DESC`,
      [userId]
    );
  }

  async getStats(userId: number) {
    const activeRows = await this.db.query<any[]>('SELECT COUNT(*) as count FROM services_histories WHERE user_id = ? AND status IN ("pending", "assigned", "processing", "out_for_delivery")', [userId]);
    const completedRows = await this.db.query<any[]>('SELECT COUNT(*) as count FROM services_histories WHERE user_id = ? AND status = "completed"', [userId]);

    return {
      active: activeRows[0]?.count || 0,
      completed: completedRows[0]?.count || 0
    };
  }

  async cancelOrder(userId: number, orderId: number, reason: string) {
    const result = await this.db.execute(
      'UPDATE services_histories SET status = "cancelled", cancel_reason = ? WHERE id = ? AND user_id = ? AND status IN ("pending", "assigned")',
      [reason, orderId, userId]
    );
    if (result.affectedRows === 0) throw new NotFoundException('Order not found or cannot be cancelled in current state');
    return { success: true };
  }

  async updateOrder(userId: number, orderId: number, data: any) {
    const fields = [];
    const params = [];
    if (data.user_description) { fields.push('user_description = ?'); params.push(data.user_description); }

    if (fields.length === 0) return { message: 'No changes detected' };

    params.push(orderId, userId);
    const result = await this.db.execute(
      `UPDATE services_histories SET ${fields.join(', ')} WHERE id = ? AND user_id = ? AND status = "pending"`,
      params
    );
    if (result.affectedRows === 0) throw new NotFoundException('Order not found or not in updatable state');
    return { success: true };
  }
}
