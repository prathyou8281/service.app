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
import { GoogleLoginDto } from './dto/google-login.dto';
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

  @Post('request-otp')
  async requestOtp(@Body('email') email: string) {
    if (!email) throw new BadRequestException('Email is required');
    return this.authService.requestOtp(email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: any) {
    const { email, otp } = body;
    if (!email || !otp) throw new BadRequestException('Email and OTP are required');
    return this.authService.verifyOtp(email, otp);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: any) {
    const { email, otp, newPassword } = body;
    if (!email || !otp || !newPassword) throw new BadRequestException('Email, OTP, and new password are required');
    return this.authService.resetPasswordWithOtp(email, otp, newPassword);
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

  @Post('validate-google-user')
  async validateGoogleUser(@Body() body: { email: string }) {
    if (!body.email) throw new BadRequestException('Email required');
    return this.authService.validateGoogleUser(body.email);
  }

  @Post('complete-google-signup')
  async completeGoogleSignup(@Body() body: any) {
    if (!body.email || !body.password || !body.phone) {
      throw new BadRequestException('Missing required fields');
    }
    return this.authService.completeGoogleProfile(body);
  }

  @Post('google-login')
  @HttpCode(HttpStatus.OK)
  async googleLogin(@Body() body: any) {
    if (!body.email) {
      throw new BadRequestException('Email is required for Google Login');
    }

    // Login OR Create user
    const result = await this.authService.loginWithGoogle(
      body.email,
      body.name,
      body.googleId,
      body.image
    );

    return {
      success: true,
      message: 'Google login successful',
      user: result,
      redirect: this.getRedirectPath(result.role),
    };
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

  // ==================== FORGOT PASSWORD ENDPOINTS ====================

  @Post('forgot-password/request')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body() body: { email: string }) {
    if (!body.email) {
      throw new BadRequestException('Email is required');
    }
    return this.authService.requestPasswordReset(body.email);
  }

  @Post('forgot-password/verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyPasswordResetOTP(@Body() body: { email: string; otp: string }) {
    if (!body.email || !body.otp) {
      throw new BadRequestException('Email and OTP are required');
    }
    return this.authService.verifyPasswordResetOTP(body.email, body.otp);
  }

  @Post('forgot-password/reset')
  @HttpCode(HttpStatus.OK)
  async resetPasswordWithOTP(@Body() body: { email: string; otp: string; newPassword: string }) {
    if (!body.email || !body.otp || !body.newPassword) {
      throw new BadRequestException('Email, OTP, and new password are required');
    }

    if (body.newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    return this.authService.resetPasswordWithOTP(body.email, body.otp, body.newPassword);
  }
}
