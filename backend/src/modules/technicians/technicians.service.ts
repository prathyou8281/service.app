import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateTechnicianDto, UpdateTechnicianDto } from './technicians.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TechniciansService {
    constructor(private readonly db: DatabaseService) { }

    async create(vendorId: number, dto: CreateTechnicianDto) {
        const { name, email, password, phone, skills } = dto;

        // Check email existence
        const rows: any = await this.db.query('SELECT id FROM technicians WHERE email = ?', [email]);
        if (rows.length > 0) throw new ConflictException('Technician email already exists');

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert
        await this.db.query(
            `INSERT INTO technicians (vendor_id, name, email, password, phone, skills, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
            [vendorId, name, email, hashedPassword, phone, skills]
        );

        return { success: true, message: 'Technician created successfully' };
    }

    async publicRegister(dto: any) {
        const { name, email, password, phone, skills } = dto;

        const rows: any = await this.db.query('SELECT id FROM technicians WHERE email = ?', [email]);
        if (rows.length > 0) throw new ConflictException('Email already registered');

        const hashedPassword = await bcrypt.hash(password, 10);

        await this.db.query(
            `INSERT INTO technicians (name, email, password, phone, skills, status) 
             VALUES (?, ?, ?, ?, ?, 'active')`,
            [name, email, hashedPassword, phone, skills]
        );

        return { success: true, message: 'Registration successful' };
    }

    async findAll(vendorId: number) {
        const rows: any = await this.db.query(
            'SELECT id, name, email, phone, skills, status, created_at FROM technicians WHERE vendor_id = ?',
            [vendorId]
        );
        return rows;
    }

    async findOne(vendorId: number, id: number) {
        const rows: any = await this.db.query(
            'SELECT id, name, email, phone, skills, status FROM technicians WHERE id = ? AND vendor_id = ?',
            [id, vendorId]
        );
        if (rows.length === 0) throw new NotFoundException('Technician not found');
        return rows[0];
    }

    async update(vendorId: number, id: number, dto: UpdateTechnicianDto) {
        // Ensure technician belongs to vendor
        await this.findOne(vendorId, id);

        const fields = [];
        const values = [];

        if (dto.name) { fields.push('name = ?'); values.push(dto.name); }
        if (dto.phone) { fields.push('phone = ?'); values.push(dto.phone); }
        if (dto.skills) { fields.push('skills = ?'); values.push(dto.skills); }
        if (dto.status) { fields.push('status = ?'); values.push(dto.status); }

        if (fields.length === 0) return { success: true }; // Nothing to update

        values.push(id);
        values.push(vendorId);

        await this.db.query(
            `UPDATE technicians SET ${fields.join(', ')} WHERE id = ? AND vendor_id = ?`,
            values
        );

        return { success: true, message: 'Technician updated' };
    }

    async remove(vendorId: number, id: number) {
        await this.findOne(vendorId, id);
        await this.db.query('DELETE FROM technicians WHERE id = ? AND vendor_id = ?', [id, vendorId]);
        return { success: true };
    }
}
