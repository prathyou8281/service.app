import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../database/database.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface UserRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  status?: string;
}

interface AdminRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  profile_photo: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class AuthService {
  constructor(private databaseService: DatabaseService) { }

  async register(registerDto: RegisterDto) {
    const { name, email, phone, password } = registerDto;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      throw new BadRequestException('Name, email, phone, and password are required');
    }

    try {
      // Check if email already exists
      const existingUsers = await this.databaseService.query<UserRow[]>(
        'SELECT id FROM users WHERE email = ?',
        [email],
      );

      if (existingUsers.length > 0) {
        throw new ConflictException('Email already registered');
      }

      // Check if phone already exists
      const existingPhone = await this.databaseService.query<UserRow[]>(
        'SELECT id FROM users WHERE phone = ?',
        [phone],
      );

      if (existingPhone.length > 0) {
        throw new ConflictException('Phone number already registered');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user - only these columns: name, email, phone, password, status
      const result = await this.databaseService.execute(
        `INSERT INTO users (name, email, phone, password, status) 
         VALUES (?, ?, ?, ?, 'active')`,
        [name, email, phone, hashedPassword],
      );

      if (!result.insertId || result.affectedRows === 0) {
        throw new InternalServerErrorException('Failed to create user');
      }

      // Return user info (without password)
      return {
        id: result.insertId,
        name,
        email,
        phone,
      };
    } catch (error) {
      // Re-throw known exceptions
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      // Handle MySQL connection errors
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Cannot connect to MySQL')) {
        throw new InternalServerErrorException('Database connection failed. Please check if MySQL is running.');
      }
      if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.message?.includes('MySQL access denied')) {
        throw new InternalServerErrorException('Database access denied. Please check database credentials.');
      }
      if (error.code === 'ER_BAD_DB_ERROR' || error.message?.includes('does not exist')) {
        throw new InternalServerErrorException('Database does not exist. Please create it first.');
      }
      if (error.message?.includes('connection pool is not initialized')) {
        throw new InternalServerErrorException('Database connection pool is not initialized.');
      }

      // Handle MySQL duplicate entry errors
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.sqlMessage?.includes('email')) {
          throw new ConflictException('Email already registered');
        }
        if (error.sqlMessage?.includes('phone')) {
          throw new ConflictException('Phone number already registered');
        }
        throw new ConflictException('Duplicate entry');
      }

      // Unknown error
      console.error('Registration error:', error);
      throw new InternalServerErrorException('Registration failed: ' + (error.message || 'Unknown error'));
    }
  }

  async adminLogin(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      // Find admin by email
      const admins = await this.databaseService.query<AdminRow[]>(
        'SELECT id, name, email, phone, password, profile_photo, status FROM admins WHERE email = ? LIMIT 1',
        [email],
      );

      if (admins.length === 0) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const admin = admins[0];

      // Check account status
      if (admin.status.toLowerCase() !== 'active') {
        throw new ForbiddenException('Account is not active or has been disabled');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Return admin info
      return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        profile_photo: admin.profile_photo,
        status: admin.status,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Admin Login error:', error);

      // Handle table not existing error specifically to give better feedback
      if (error.code === 'ER_NO_SUCH_TABLE' || (error.message && error.message.includes("admins' doesn't exist"))) {
        throw new InternalServerErrorException("The 'admins' table does not exist in the database. Please create it first.");
      }

      throw new InternalServerErrorException('Login failed');
    }
  }
}
