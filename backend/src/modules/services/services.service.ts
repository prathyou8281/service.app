import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateServiceDto, UpdateServiceDto } from './services.dto';

@Injectable()
export class ServicesService {
    constructor(private readonly db: DatabaseService) { }

    // Vendor: Create Service
    async create(vendorId: number, dto: CreateServiceDto) {
        const { name, short_description, description, price, video, image, icon } = dto;
        await this.db.query(
            `INSERT INTO services (vendor_id, name, short_description, description, price, video, image, icon, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
            [vendorId, name, short_description, description, price, video, image, icon]
        );
        return { success: true, message: 'Service created' };
    }

    // Vendor: List own services
    async findAllByVendor(vendorId: number) {
        return this.db.query(
            'SELECT * FROM services WHERE vendor_id = ? ORDER BY created_at DESC',
            [vendorId]
        );
    }

    // Public/User: List unique service categories (by name)
    async findUniqueServices() {
        return this.db.query(
            "SELECT name, short_description, icon, MIN(price) as starting_price, COUNT(vendor_id) as vendor_count FROM services WHERE status = 'active' GROUP BY name, short_description, icon"
        );
    }

    // Public/User: Find all vendors offering a specific service by name
    async findVendorsByServiceName(serviceName: string) {
        return this.db.query(
            `SELECT s.*, v.name as vendor_name, v.email as vendor_email, v.phone as vendor_phone, v.description as vendor_description 
             FROM services s 
             JOIN vendors v ON s.vendor_id = v.id 
             WHERE s.name = ? AND s.status = 'active'`,
            [serviceName]
        );
    }

    // Public/User: List all active services (raw)
    async findAllActive() {
        return this.db.query(
            "SELECT s.*, v.name as vendor_name FROM services s JOIN vendors v ON s.vendor_id = v.id WHERE s.status = 'active'"
        );
    }

    // Public: Find single active service
    async findOnePublic(id: number) {
        const rows: any = await this.db.query(
            "SELECT s.*, v.name as vendor_name FROM services s JOIN vendors v ON s.vendor_id = v.id WHERE s.id = ? AND s.status = 'active'",
            [id]
        );
        if (rows.length === 0) throw new NotFoundException('Service not found');
        return rows[0];
    }

    // Vendor: Update Service
    async update(vendorId: number, id: number, dto: UpdateServiceDto) {
        // Check ownership
        const rows: any = await this.db.query('SELECT id FROM services WHERE id = ? AND vendor_id = ?', [id, vendorId]);
        if (rows.length === 0) throw new NotFoundException('Service not found');

        const fields = [];
        const values = [];

        if (dto.name) { fields.push('name = ?'); values.push(dto.name); }
        if (dto.short_description) { fields.push('short_description = ?'); values.push(dto.short_description); }
        if (dto.description) { fields.push('description = ?'); values.push(dto.description); }
        if (dto.price) { fields.push('price = ?'); values.push(dto.price); }
        if (dto.video) { fields.push('video = ?'); values.push(dto.video); }
        if (dto.image) { fields.push('image = ?'); values.push(dto.image); }
        if (dto.icon) { fields.push('icon = ?'); values.push(dto.icon); }
        if (dto.status) { fields.push('status = ?'); values.push(dto.status); }

        if (fields.length === 0) return { success: true };

        values.push(id);

        await this.db.query(
            `UPDATE services SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return { success: true, message: 'Service updated' };
    }

    async remove(vendorId: number, id: number) {
        const rows: any = await this.db.query('SELECT id FROM services WHERE id = ? AND vendor_id = ?', [id, vendorId]);
        if (rows.length === 0) throw new NotFoundException('Service not found');
        await this.db.query('DELETE FROM services WHERE id = ?', [id]);
        return { success: true };
    }
}
