import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.authService.login(loginDto);
      return {
        success: true,
        message: 'Login successful',
        user,
        redirect: '/welcome',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Handle validation errors
      if (error.response && error.response.message) {
        throw new BadRequestException(error.response.message);
      }

      throw new InternalServerErrorException('Login failed');
    }
  }
}
