import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, OrderStatus } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
    constructor(private readonly db: DatabaseService) { }

    async create(userId: number, dto: CreateOrderDto) {
        const result = await this.db.execute(
            `INSERT INTO services_histories (user_id, service_id, vendor_id, user_description, total_amount, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, dto.service_id, dto.vendor_id, dto.user_description, dto.total_amount, OrderStatus.PENDING]
        );
        return { success: true, data: { id: result.insertId, status: OrderStatus.PENDING } };
    }

    async findAll() {
        return this.db.query(
            `SELECT h.*, s.name as service_name, v.name as vendor_name, u.name as user_name, t.name as technician_name
       FROM services_histories h
       LEFT JOIN services s ON h.service_id = s.id
       LEFT JOIN vendors v ON h.vendor_id = v.id
       LEFT JOIN users u ON h.user_id = u.id
       LEFT JOIN technicians t ON h.technician_id = t.id
       ORDER BY h.id DESC`
        );
    }

    async findOne(id: number) {
        const rows = await this.db.query<any[]>(
            `SELECT h.*, s.name as service_name, v.name as vendor_name, u.name as user_name, t.name as technician_name
       FROM services_histories h
       LEFT JOIN services s ON h.service_id = s.id
       LEFT JOIN vendors v ON h.vendor_id = v.id
       LEFT JOIN users u ON h.user_id = u.id
       LEFT JOIN technicians t ON h.technician_id = t.id
       WHERE h.id = ?`,
            [id]
        );
        if (!rows.length) throw new NotFoundException('Order not found');
        return rows[0];
    }

    async findByUser(userId: number) {
        return this.db.query(
            `SELECT h.*, s.name as service_name, v.name as vendor_name, t.name as technician_name
       FROM services_histories h
       LEFT JOIN services s ON h.service_id = s.id
       LEFT JOIN vendors v ON h.vendor_id = v.id
       LEFT JOIN technicians t ON h.technician_id = t.id
       WHERE h.user_id = ?
       ORDER BY h.id DESC`,
            [userId]
        );
    }

    async findByVendor(vendorId: number) {
        return this.db.query(
            `SELECT h.*, s.name as service_name, u.name as user_name, t.name as technician_name
       FROM services_histories h
       LEFT JOIN services s ON h.service_id = s.id
       LEFT JOIN users u ON h.user_id = u.id
       LEFT JOIN technicians t ON h.technician_id = t.id
       WHERE h.vendor_id = ?
       ORDER BY h.id DESC`,
            [vendorId]
        );
    }

    async findByTechnician(technicianId: number) {
        return this.db.query(
            `SELECT h.*, s.name as service_name, u.name as user_name, v.name as vendor_name
       FROM services_histories h
       LEFT JOIN services s ON h.service_id = s.id
       LEFT JOIN users u ON h.user_id = u.id
       LEFT JOIN vendors v ON h.vendor_id = v.id
       WHERE h.technician_id = ?
       ORDER BY h.id DESC`,
            [technicianId]
        );
    }

    async update(id: number, dto: UpdateOrderDto, actorRole: string, actorId: number) {
        const order = await this.findOne(id);

        // Permission check
        if (actorRole === 'Vendor' && order.vendor_id !== actorId) throw new ForbiddenException('Unauthorized');
        if (actorRole === 'Technician' && order.technician_id !== actorId) throw new ForbiddenException('Unauthorized');
        if (actorRole === 'User' && order.user_id !== actorId) throw new ForbiddenException('Unauthorized');

        const fields = [];
        const params = [];

        if (dto.status) {
            // Validate transition logic
            // Validate transition logic
            if (dto.status === OrderStatus.PROCESSING && order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PROCESSING && order.status !== OrderStatus.ASSIGNED) {
                // Allow re-setting to processing if already processing or assigned
            }

            fields.push('status = ?');
            params.push(dto.status);
        }

        if (dto.technician_description !== undefined) {
            fields.push('technician_description = ?');
            params.push(dto.technician_description);
        }

        if (dto.technician_id !== undefined && (actorRole === 'Vendor' || actorRole === 'Admin')) {
            fields.push('technician_id = ?');
            params.push(dto.technician_id);
        }

        if (fields.length === 0) return { message: 'No changes' };

        params.push(id);
        await this.db.execute(`UPDATE services_histories SET ${fields.join(', ')} WHERE id = ?`, params);
        return { success: true };
    }
}
