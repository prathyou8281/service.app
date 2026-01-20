import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
    constructor(private readonly db: DatabaseService) { }

    async getMetrics() {
        const [users]: any = await this.db.query('SELECT COUNT(*) as count FROM users');
        const [vendors]: any = await this.db.query('SELECT COUNT(*) as count FROM vendors');
        const [technicians]: any = await this.db.query('SELECT COUNT(*) as count FROM technicians');

        const [pendingVendors]: any = await this.db.query('SELECT COUNT(*) as count FROM vendors WHERE status = "pending"');

        return {
            success: true,
            data: {
                users: users.count,
                vendors: vendors.count,
                technicians: technicians.count,
                pendingVendors: pendingVendors.count,
            },
        };
    }

    async getEntities(entity: string) {
        const tableMap = {
            users: 'users',
            vendors: 'vendors',
            technicians: 'technicians',
        };
        const table = tableMap[entity];
        if (!table) throw new Error('Invalid entity');

        const rows = await this.db.query(`SELECT * FROM ${table} ORDER BY created_at DESC`);
        return { success: true, data: rows };
    }

    async updateEntity(entity: string, body: any) {
        const { id, ...updates } = body;
        const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
        const values = [...Object.values(updates), id];

        await this.db.query(`UPDATE ${entity} SET ${fields} WHERE id = ?`, values);
        return { success: true };
    }

    async createEntity(entity: string, body: any) {
        const { password, ...details } = body;
        const hashedPassword = await bcrypt.hash(password || 'password', 10);

        // Ensure numeric fields are numbers
        if (details.vendor_id) details.vendor_id = Number(details.vendor_id);

        const keys = [...Object.keys(details), 'password', 'status'];
        const placeholders = keys.map(() => '?').join(', ');
        const values = [...Object.values(details), hashedPassword, 'active'];

        try {
            await this.db.query(
                `INSERT INTO ${entity} (${keys.join(', ')}) VALUES (${placeholders})`,
                values
            );
            return { success: true };
        } catch (error) {
            console.error(`Error creating ${entity}:`, error);
            throw new Error(error.message);
        }
    }

    async deleteEntity(entity: string, id: number) {
        await this.db.query(`DELETE FROM ${entity} WHERE id = ?`, [id]);
        return { success: true };
    }

    async getPendingVendors() {
        const rows = await this.db.query("SELECT * FROM vendors WHERE status = 'pending' ORDER BY created_at DESC");
        return { success: true, data: rows };
    }

    async verifyVendor(vendorId: number, status: 'active' | 'rejected') {
        const isVerified = status === 'active' ? 1 : 0;
        await this.db.query(
            "UPDATE vendors SET status = ?, is_verified = ? WHERE id = ?",
            [status, isVerified, vendorId]
        );
        return { success: true, message: `Vendor ${status === 'active' ? 'approved' : 'rejected'}` };
    }

    async updateAdminProfile(adminId: number, body: any) {
        const { name, email, phone } = body;
        await this.db.query(
            'UPDATE admins SET name = ?, email = ?, phone = ? WHERE id = ?',
            [name, email, phone, adminId]
        );
        return { success: true };
    }

    async changeAdminPassword(adminId: number, body: any) {
        const { currentPassword, newPassword } = body;
        const [admin]: any = await this.db.query('SELECT password FROM admins WHERE id = ?', [adminId]);
        if (!admin) throw new Error('Admin not found');

        const isValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isValid) throw new Error('Current password is incorrect');

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.db.query('UPDATE admins SET password = ? WHERE id = ?', [hashedPassword, adminId]);
        return { success: true };
    }
}
