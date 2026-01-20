import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateBookingDto, AssignTechnicianDto, UpdateJobStatusDto } from './service-history.dto';

@Injectable()
export class ServiceHistoryService {
    constructor(private readonly db: DatabaseService) { }

    // User: Book Service
    async create(userId: number, dto: CreateBookingDto) {
        const { service_id, description } = dto;

        // Get service details for price and vendor
        const rows: any = await this.db.query('SELECT price, vendor_id FROM services WHERE id = ?', [service_id]);
        if (rows.length === 0) throw new NotFoundException('Service not found');
        const { price, vendor_id } = rows[0];

        await this.db.query(
            `INSERT INTO services_histories 
       (user_id, service_id, vendor_id, user_description, total_amount, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
            [userId, service_id, vendor_id, description, price]
        );

        return { success: true, message: 'Service booked successfully' };
    }

    // User: My Bookings
    async findByUser(userId: number) {
        return this.db.query(
            `SELECT h.*, s.name as service_name, v.name as vendor_name 
       FROM services_histories h
       JOIN services s ON h.service_id = s.id
       JOIN vendors v ON h.vendor_id = v.id
       WHERE h.user_id = ?
       ORDER BY h.created_at DESC`,
            [userId]
        );
    }

    // Vendor: My Incoming Requests
    async findByVendor(vendorId: number) {
        return this.db.query(
            `SELECT h.*, s.name as service_name, u.name as user_name, t.name as technician_name
       FROM services_histories h
       JOIN services s ON h.service_id = s.id
       JOIN users u ON h.user_id = u.id
       LEFT JOIN technicians t ON h.technician_id = t.id
       WHERE h.vendor_id = ?
       ORDER BY h.created_at DESC`,
            [vendorId]
        );
    }

    // Vendor: Assign Technician
    async assignTechnician(vendorId: number, bookingId: number, dto: AssignTechnicianDto) {
        // 1. Check booking ownership
        const rows: any = await this.db.query('SELECT id FROM services_histories WHERE id = ? AND vendor_id = ?', [bookingId, vendorId]);
        if (rows.length === 0) throw new NotFoundException('Booking not found');

        // 2. Check technician ownership
        const techs: any = await this.db.query('SELECT id FROM technicians WHERE id = ? AND vendor_id = ?', [dto.technician_id, vendorId]);
        if (techs.length === 0) throw new ForbiddenException('Technician invalid');

        await this.db.query('UPDATE services_histories SET technician_id = ?, status = ? WHERE id = ?', [dto.technician_id, 'assigned', bookingId]);
        return { success: true, message: 'Technician assigned' };
    }

    // Technician: My Jobs
    async findByTechnician(technicianId: number) {
        return this.db.query(
            `SELECT h.*, s.name as service_name, u.name as user_name, u.phone as user_phone, u.name as user_name
        FROM services_histories h
        JOIN services s ON h.service_id = s.id
        JOIN users u ON h.user_id = u.id
        WHERE h.technician_id = ?
        ORDER BY h.created_at DESC`,
            [technicianId]
        );
    }

    // Technician: Update Status
    async updateStatus(technicianId: number, bookingId: number, dto: UpdateJobStatusDto) {
        const rows: any = await this.db.query('SELECT id FROM services_histories WHERE id = ? AND technician_id = ?', [bookingId, technicianId]);
        if (rows.length === 0) throw new NotFoundException('Job not found');

        await this.db.query('UPDATE services_histories SET status = ?, technician_description = ? WHERE id = ?', [dto.status, dto.notes || '', bookingId]);
        return { success: true, message: 'Status updated' };
    }
}
