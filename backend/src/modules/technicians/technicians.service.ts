import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class TechniciansService {
    constructor(private readonly db: DatabaseService) { }

    async getProfile(id: number) {
        const rows = await this.db.query<any[]>(
            'SELECT id, name, email, phone, status, vendor_id, skills, avatar FROM technicians WHERE id = ?',
            [id]
        );
        if (!rows.length) throw new NotFoundException('Technician not found');
        return rows[0];
    }

    async updateProfile(id: number, data: any) {
        const fields = [];
        const params = [];

        if (data.name) { fields.push('name = ?'); params.push(data.name); }
        if (data.phone) { fields.push('phone = ?'); params.push(data.phone); }
        if (data.skills) { fields.push('skills = ?'); params.push(data.skills); }
        if (data.avatar) { fields.push('avatar = ?'); params.push(data.avatar); }

        if (fields.length === 0) return { message: 'No changes detected' };

        params.push(id);
        await this.db.execute(`UPDATE technicians SET ${fields.join(', ')} WHERE id = ?`, params);
        return { success: true };
    }

    // --- Service History / Assigned Jobs ---
    async getAssignedJobs(technicianId: number) {
        return this.db.query(
            `SELECT h.*, s.name as service_name, u.name as user_name, v.name as vendor_name, u.phone as user_phone
       FROM services_histories h
       JOIN services s ON h.service_id = s.id
       JOIN users u ON h.user_id = u.id
       JOIN vendors v ON h.vendor_id = v.id
       WHERE h.technician_id = ?`,
            [technicianId]
        );
    }

    async updateJobStatus(technicianId: number, historyId: number, status: string, notes?: string) {
        // Valid status per prompt: pending → in_progress → completed / cancelled
        const result = await this.db.execute(
            `UPDATE services_histories 
       SET status = ?, technician_description = ? 
       WHERE id = ? AND technician_id = ?`,
            [status, notes, historyId, technicianId]
        );

        if (result.affectedRows === 0) throw new NotFoundException('Job not found or unauthorized');
        return { success: true };
    }

    async getStats(id: number) {
        const tasksRows = await this.db.query<any[]>('SELECT COUNT(*) as count FROM services_histories WHERE technician_id = ? AND status IN ("pending", "assigned", "processing", "out_for_delivery")', [id]);
        const completedRows = await this.db.query<any[]>('SELECT COUNT(*) as count FROM services_histories WHERE technician_id = ? AND status = "completed"', [id]);

        return {
            tasks: tasksRows[0]?.count || 0,
            completed: completedRows[0]?.count || 0,
            rating: 4.9 // Mocked
        };
    }

    async register(data: any) {
        const existing = await this.db.query<any[]>(
            'SELECT id FROM technicians WHERE email = ?',
            [data.email]
        );
        if (existing.length > 0) return { success: false, message: 'Email already registered' };

        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const result = await this.db.execute(
            `INSERT INTO technicians (name, email, phone, password, skills, business_type_id, service_type_id, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [data.name, data.email, data.phone, hashedPassword, data.skills, data.business_type_id, data.service_type_id]
        );

        // Add Admin Notification
        await this.db.execute(
            `INSERT INTO admin_notifications (type, title, message, payload) 
             VALUES ('new_technician', 'New Technician Application', ?, ?)`,
            [`Technician ${data.name} applied for verification. Skills: ${data.skills}`, JSON.stringify({ techId: result.insertId, name: data.name, email: data.email })]
        );

        return {
            success: true,
            data: {
                id: result.insertId,
                name: data.name,
                email: data.email,
                role: 'technician'
            }
        };
    }
}
