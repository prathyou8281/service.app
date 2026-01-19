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

  // ... register (unchanged)

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

  async adminRegister(registerDto: any) {
    // ... (if needed)
  }

  async seedAdmin() {
    // Ensure table exists (quick fix)
    try {
      await this.db.query(`
        CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            status VARCHAR(50) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (e) { console.error('Table check failed', e); }

    const email = 'admin@gmail.com';
    const hashedPassword = await bcrypt.hash('password', 10);

    const rows: any = await this.db.query('SELECT id FROM admins WHERE email = ?', [email]);
    if (rows && rows.length > 0) {
      await this.db.query('UPDATE admins SET password = ?, status = ? WHERE email = ?', [hashedPassword, 'active', email]);
    } else {
      await this.db.query('INSERT INTO admins (name, email, password, status) VALUES (?, ?, ?, ?)', ['Admin', email, hashedPassword, 'active']);
    }
    return { success: true, message: 'Admin seeded' };
  }
}
