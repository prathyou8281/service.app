import {
  Injectable,
  ConflictException,
  UnauthorizedException,
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

@Injectable()
export class AuthService {
  constructor(private databaseService: DatabaseService) {}

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

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      // Find user by email
      const users = await this.databaseService.query<UserRow[]>(
        'SELECT * FROM users WHERE email = ? LIMIT 1',
        [email],
      );

      if (users.length === 0) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const user = users[0];

      // Check account status
      if (user.status && user.status.toLowerCase() !== 'active') {
        throw new UnauthorizedException('Account is not active');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Return user info (without password)
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        role: 'User',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Login error:', error);
      throw new InternalServerErrorException('Login failed');
    }
  }
}
