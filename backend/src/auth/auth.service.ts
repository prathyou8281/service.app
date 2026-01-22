import { DatabaseService } from '../database/database.service';
import { Injectable, ConflictException, UnauthorizedException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService
  ) { }

  async register(registerDto: RegisterDto): Promise<void> {
    const { name, email, phone, password } = registerDto;

    const rows: any = await this.db.query(
      'SELECT id FROM users WHERE email = ?',
      [email],
    );

    if (rows.length > 0) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await this.db.query(
        `INSERT INTO users (name, email, phone, password, status)
         VALUES (?, ?, ?, ?, 'active')`,
        [name, email, phone, hashedPassword],
      );
    } catch (error) {
      console.error('Registration error:', error);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const rows: any = await this.db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (!rows || rows.length === 0) throw new UnauthorizedException('Invalid credentials');
    const user = rows[0];

    if (user.status !== 'active') throw new ForbiddenException('Account inactive');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    delete user.password;
    const payload = { sub: user.id, email: user.email, role: 'user' };

    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async adminLogin(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const rows: any = await this.db.query('SELECT * FROM admins WHERE email = ?', [email]);

    if (!rows || rows.length === 0) throw new UnauthorizedException('Invalid credentials');
    const admin = rows[0];

    if (admin.status !== 'active') throw new ForbiddenException('Account inactive');

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    delete admin.password;
    const payload = { sub: admin.id, email: admin.email, role: 'admin' };

    return {
      ...admin,
      access_token: this.jwtService.sign(payload),
    };
  }

  async technicianLogin(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const rows: any = await this.db.query('SELECT * FROM technicians WHERE email = ?', [email]);

    if (!rows || rows.length === 0) throw new UnauthorizedException('Invalid credentials');
    const tech = rows[0];

    if (tech.status !== 'active') throw new ForbiddenException('Account inactive');

    const isValid = await bcrypt.compare(password, tech.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    delete tech.password;
    const payload = { sub: tech.id, email: tech.email, role: 'technician' };

    return {
      ...tech,
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUserProfile(id: number) {
    const rows: any = await this.db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!rows || rows.length === 0) throw new UnauthorizedException('User not found');
    const { password, ...result } = rows[0];
    return result;
  }

  async getAdminProfile(id: number) {
    const rows: any = await this.db.query('SELECT * FROM admins WHERE id = ?', [id]);
    if (!rows || rows.length === 0) throw new UnauthorizedException('Admin not found');
    const { password, ...result } = rows[0];
    return result;
  }

  async initSchema() {
    try {
      // 1. Technicians
      await this.db.query(`
            CREATE TABLE IF NOT EXISTS technicians (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                vendor_id BIGINT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                skills TEXT,
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

      // 2. Services
      await this.db.query(`
            CREATE TABLE IF NOT EXISTS services (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                vendor_id BIGINT NOT NULL,
                name VARCHAR(255) NOT NULL,
                short_description VARCHAR(500),
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                video VARCHAR(500),
                image VARCHAR(500),
                icon VARCHAR(100),
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

      // Seed dummy services if empty and vendors exist
      const existingServices: any = await this.db.query('SELECT id FROM services LIMIT 1');
      const allVendors: any = await this.db.query('SELECT id FROM vendors');

      if (existingServices.length === 0 && allVendors.length > 0) {
        const dummyServices = [
          ['Laptop & PC Repair', 'Screen, battery, keyboard & motherboard repairs.', 800, 'Wrench'],
          ['CCTV Installation', 'Indoor & outdoor CCTV with mobile access.', 3500, 'Camera'],
          ['Data Recovery', 'Recover data from HDD, SSD, USB & memory cards.', 2500, 'Database'],
          ['Networking & Wi-Fi Setup', 'Home & office networking with secure configuration.', 1200, 'Router'],
          ['Software & OS Installation', 'Windows, drivers, antivirus & optimization services.', 500, 'HardDrive'],
          ['Printer Service', 'Printer repair, toner refill & cartridge replacement.', 450, 'Printer'],
          ['Refurbished Laptops', 'Certified laptops with warranty at affordable prices.', 15000, 'Laptop'],
          ['New Laptops', 'Latest branded laptops with full manufacturer warranty.', 45000, 'Laptop'],
        ];

        // Seed each service for up to 3 different vendors to create variety
        for (const s of dummyServices) {
          // Take up to 3 vendors (or fewer if total vendors < 3)
          const sliceSize = Math.min(allVendors.length, 3);
          const vendorsForThisService = allVendors.slice(0, sliceSize);

          for (let i = 0; i < vendorsForThisService.length; i++) {
            const vendor = vendorsForThisService[i];
            // vary price slightly for different vendors
            const priceVariation = i * 150;
            await this.db.query(
              'INSERT INTO services (name, short_description, price, icon, vendor_id, status) VALUES (?, ?, ?, ?, ?, "active")',
              [s[0], s[1], (s[2] as number) + priceVariation, s[3], vendor.id]
            );
          }
        }
      }

      // 3. Service Histories
      await this.db.query(`
            CREATE TABLE IF NOT EXISTS services_histories (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                service_id BIGINT NOT NULL,
                vendor_id BIGINT NOT NULL,
                technician_id BIGINT NULL,
                user_description TEXT,
                technician_description TEXT,
                total_amount DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

      // 4. Addresses
      const addressTables = ['users_addresses', 'admins_addresses', 'vendors_addresses', 'technicians_addresses'];
      for (const table of addressTables) {
        const entityId = table.split('_')[0].slice(0, -1) + '_id';
        await this.db.query(`
                CREATE TABLE IF NOT EXISTS ${table} (
                    id BIGINT AUTO_INCREMENT PRIMARY KEY,
                    ${entityId} BIGINT NOT NULL,
                    address_line1 VARCHAR(255),
                    address_line2 VARCHAR(255),
                    city VARCHAR(100),
                    state VARCHAR(100),
                    zip_code VARCHAR(20),
                    country VARCHAR(100) DEFAULT 'USA'
                )
            `);
      }
      return { success: true, message: 'Schema Initialized' };
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(e.message);
    }
  }
}
