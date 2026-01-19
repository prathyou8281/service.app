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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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
      // Return errors in the format { success: false, message: "..." }
      let message = 'Registration failed';
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      if (error.response) {
        // Handle validation errors from class-validator
        if (Array.isArray(error.response.message)) {
          message = error.response.message.join(', ');
          statusCode = HttpStatus.BAD_REQUEST;
        } else if (error.response.message) {
          message = error.response.message;
          statusCode = error.status || HttpStatus.BAD_REQUEST;
        }
      } else if (error.message) {
        message = error.message;
        // Map exception types to status codes
        if (error.status === HttpStatus.CONFLICT) {
          statusCode = HttpStatus.CONFLICT;
        } else if (error.status === HttpStatus.BAD_REQUEST) {
          statusCode = HttpStatus.BAD_REQUEST;
        } else if (error.status === HttpStatus.INTERNAL_SERVER_ERROR) {
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        }
      }

      // Throw HttpException with custom response body
      throw new HttpException(
        {
          success: false,
          message: message,
        },
        statusCode,
      );
    }
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginDto: LoginDto) {
    try {
      const admin = await this.authService.adminLogin(loginDto);
      return {
        message: 'Login successful',
        admin,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new HttpException(
          {
            message: error.message || 'Invalid email or password',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (error instanceof ForbiddenException) {
        throw new HttpException(
          {
            message: error.message || 'Account is not active',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      if (error instanceof InternalServerErrorException) {
        throw new HttpException(
          {
            message: error.message || 'Login failed',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        {
          message: 'Process failed',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
