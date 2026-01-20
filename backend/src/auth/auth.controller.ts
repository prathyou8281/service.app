import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /* ===================== REGISTER ===================== */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    try {
      await this.authService.register(registerDto);
      return {
        success: true,
        message: 'Registration successful',
      };
    } catch (error) {
      let message = 'Registration failed';
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      if (error instanceof BadRequestException) {
        message = error.message;
        statusCode = HttpStatus.BAD_REQUEST;
      }

      throw new HttpException(
        { success: false, message },
        statusCode,
      );
    }
  }

  /* ===================== USER LOGIN ===================== */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.authService.login(loginDto);
      return {
        success: true,
        message: 'Login successful',
        user,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new HttpException(
          { success: false, message: 'Invalid email or password' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (error instanceof ForbiddenException) {
        throw new HttpException(
          { success: false, message: 'Account is not active' },
          HttpStatus.FORBIDDEN,
        );
      }

      throw new HttpException(
        { success: false, message: 'Login failed' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* ===================== ADMIN LOGIN ===================== */
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginDto: LoginDto) {
    try {
      const admin = await this.authService.adminLogin(loginDto);
      return {
        success: true,
        message: 'Admin login successful',
        admin,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new HttpException(
          { success: false, message: 'Invalid email or password' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (error instanceof ForbiddenException) {
        throw new HttpException(
          { success: false, message: 'Admin account is not active' },
          HttpStatus.FORBIDDEN,
        );
      }

      throw new HttpException(
        { success: false, message: 'Admin login failed' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* ================= TECHNICIAN LOGIN ================= */
  @Post('technician/login')
  @HttpCode(HttpStatus.OK)
  async technicianLogin(@Body() loginDto: LoginDto) {
    try {
      const tech = await this.authService.technicianLogin(loginDto);
      return {
        success: true,
        message: 'Technician login successful',
        technician: tech,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message || 'Login failed' },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /* ===================== PROFILE ===================== */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Get('me')
  async getProfile(@Request() req) {
    return this.authService.getUserProfile(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('admin/me')
  async getAdminProfile(@Request() req) {
    return this.authService.getAdminProfile(req.user.userId);
  }

  @Get('init-schema')
  async initSchema() {
    return this.authService.initSchema();
  }
}
