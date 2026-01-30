import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class ServicesService {
    constructor(private readonly db: DatabaseService) { }

    async findAll(query?: any) {
        let sql = `
            SELECT 
                s.*, 
                v.name as vendor_name, 
                v.phone as vendor_phone, 
                v.description as vendor_description, 
                v.is_verified, 
                st.name as service_type_name, 
                bt.name as business_type_name
            FROM services s
            JOIN vendors v ON s.vendor_id = v.id
            LEFT JOIN service_types st ON s.service_type_id = st.id
            LEFT JOIN business_types bt ON v.business_type_id = bt.id
            WHERE s.status = 'active' AND v.status = 'active'
        `;
        const params: any[] = [];

        if (query?.business_type_id) {
            sql += ' AND v.business_type_id = ?';
            params.push(query.business_type_id);
        }

        if (query?.service_type_id) {
            sql += ' AND s.service_type_id = ?';
            params.push(query.service_type_id);
        }

        if (query?.name) {
            sql += ' AND s.name LIKE ?';
            params.push(`%${query.name}%`);
        }

        return this.db.query(sql, params);
    }

    async findOne(id: number) {
        const rows = await this.db.query<any[]>(
            `SELECT s.*, v.name as vendor_name, st.name as service_type_name 
             FROM services s 
             JOIN vendors v ON s.vendor_id = v.id 
             LEFT JOIN service_types st ON s.service_type_id = st.id
             WHERE s.id = ?`,
            [id]
        );
        return rows.length ? rows[0] : null;
    }

    async getServiceTypes() {
        return this.db.query('SELECT * FROM service_types WHERE status = "active"');
    }
}
