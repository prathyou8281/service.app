import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../database/database.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';

interface BaseUser {
  id: number;
  email: string;
  password: string;
  status: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) { }

  private otps = new Map<string, { code: string, expires: number }>();

  async requestOtp(email: string) {
    const tableMap = ['admins', 'vendors', 'technicians', 'users'];
    let exists = false;

    for (const table of tableMap) {
      const rows = await this.databaseService.query<any[]>(
        `SELECT id FROM ${table} WHERE email = ? LIMIT 1`,
        [email]
      );
      if (rows.length > 0) {
        exists = true;
        break;
      }
    }

    if (!exists) throw new BadRequestException('Account not found with this email identifier');

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    this.otps.set(email, {
      code: otpCode,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    console.log(`[IDENTITY SYSTEM] OTP for ${email}: ${otpCode}`);
    return { success: true, message: 'Recovery code dispatched to terminal' };
  }

  async verifyOtp(email: string, code: string) {
    const record = this.otps.get(email);
    if (!record || record.code !== code || record.expires < Date.now()) {
      throw new BadRequestException('Invalid or expired verification code');
    }
    return { success: true, message: 'Identity verified' };
  }

  async resetPasswordWithOtp(email: string, otp: string, newPass: string) {
    await this.verifyOtp(email, otp);

    // Clear OTP after use
    this.otps.delete(email);

    return this.resetPassword(email, newPass);
  }

  private async generateToken(user: any, role: Role) {
    const payload = {
      id: user.id,
      role: role,
      status: user.status || 'active'
    };
    return this.jwtService.sign(payload);
  }

  private async findUserByEmail(email: string, role: Role): Promise<BaseUser | null> {
    const tableMap = {
      [Role.Admin]: 'admins',
      [Role.Vendor]: 'vendors',
      [Role.Technician]: 'technicians',
      [Role.User]: 'users',
    };

    const tableName = tableMap[role];
    const rows = await this.databaseService.query<BaseUser[]>(
      `SELECT * FROM ${tableName} WHERE email = ? LIMIT 1`,
      [email],
    );

    return rows.length > 0 ? rows[0] : null;
  }

  async login(loginDto: LoginDto, role: Role) {
    const { email, password } = loginDto;

    const user = await this.findUserByEmail(email, role);

    if (!user) {
      throw new UnauthorizedException(`Invalid email or password for ${role} profile`);
    }

    // Status Check
    const inactiveStatuses = ['inactive', 'blocked', 'suspended'];
    if (inactiveStatuses.includes(user.status?.toLowerCase())) {
      throw new UnauthorizedException(`Account is ${user.status}. Please contact support.`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const access_token = await this.generateToken(user, role);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: role,
      status: user.status,
      access_token: access_token,
    };
  }

  // User Registration (Only customers can self-register)
  async register(registerDto: RegisterDto) {
    const { name, email, phone, password } = registerDto;

    try {
      const existing = await this.databaseService.query<any[]>(
        'SELECT id FROM users WHERE email = ? OR phone = ?',
        [email, phone],
      );

      if (existing.length > 0) {
        throw new ConflictException('Email or phone already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await this.databaseService.execute(
        `INSERT INTO users (name, email, phone, password, status) 
         VALUES (?, ?, ?, ?, 'active')`,
        [name, email, phone, hashedPassword],
      );

      return {
        id: result.insertId,
        name,
        email,
        phone,
      };
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async changePassword(userId: number, role: Role, oldPass: string, newPass: string) {
    const tableMap = {
      [Role.Admin]: 'admins',
      [Role.Vendor]: 'vendors',
      [Role.Technician]: 'technicians',
      [Role.User]: 'users',
    };

    const tableName = tableMap[role];
    const rows = await this.databaseService.query<BaseUser[]>(
      `SELECT password FROM ${tableName} WHERE id = ? LIMIT 1`,
      [userId],
    );

    if (rows.length === 0) throw new BadRequestException('User not found');

    const isMatch = await bcrypt.compare(oldPass, rows[0].password);
    if (!isMatch) throw new UnauthorizedException('Current password does not match');

    const hashed = await bcrypt.hash(newPass, 10);
    await this.databaseService.execute(
      `UPDATE ${tableName} SET password = ? WHERE id = ?`,
      [hashed, userId],
    );

    return { success: true, message: 'Password updated successfully' };
  }

  async resetPassword(email: string, newPass: string) {
    const tableMap = {
      admin: 'admins',
      vendor: 'vendors',
      technician: 'technicians',
      user: 'users',
    };

    let targetTable = '';

    // Find which table has this email
    for (const [role, tableName] of Object.entries(tableMap)) {
      const rows = await this.databaseService.query<any[]>(
        `SELECT id FROM ${tableName} WHERE email = ? LIMIT 1`,
        [email]
      );
      if (rows.length > 0) {
        targetTable = tableName;
        break;
      }
    }

    if (!targetTable) {
      throw new BadRequestException('Account not found with this email');
    }

    const hashed = await bcrypt.hash(newPass, 10);
    await this.databaseService.execute(
      `UPDATE ${targetTable} SET password = ? WHERE email = ?`,
      [hashed, email]
    );

    return { success: true, message: 'Identity credentials restored successfully' };
  }
}
