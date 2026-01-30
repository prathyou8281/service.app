import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  UnauthorizedException,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() body: any) {
    const { oldPassword, newPassword } = body;
    if (!oldPassword || !newPassword) {
      throw new BadRequestException('Old and new passwords are required');
    }
    return this.authService.changePassword(
      req.user.id,
      req.user.role,
      oldPassword,
      newPassword,
    );
  }

  @Post('user/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(registerDto);
      return {
        success: true,
        message: 'Registration successful',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.handleLogin(loginDto, Role.Admin);
  }

  @Post('vendor/login')
  @HttpCode(HttpStatus.OK)
  async vendorLogin(@Body() loginDto: LoginDto) {
    return this.handleLogin(loginDto, Role.Vendor);
  }

  @Post('technician/login')
  @HttpCode(HttpStatus.OK)
  async technicianLogin(@Body() loginDto: LoginDto) {
    return this.handleLogin(loginDto, Role.Technician);
  }

  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  async userLogin(@Body() loginDto: LoginDto) {
    return this.handleLogin(loginDto, Role.User);
  }

  private async handleLogin(loginDto: LoginDto, role: Role) {
    try {
      const result = await this.authService.login(loginDto, role);
      return {
        success: true,
        message: `${role} login successful`,
        user: result,
        redirect: this.getRedirectPath(role),
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        error.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private getRedirectPath(role: Role): string {
    switch (role) {
      case Role.Admin: return '/admin/dashboard';
      case Role.Vendor: return '/vendor/dashboard';
      case Role.Technician: return '/technician/dashboard';
      default: return '/welcome';
    }
  }
}
