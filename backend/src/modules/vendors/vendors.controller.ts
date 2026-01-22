import { Body, Controller, Post, BadRequestException, UseGuards, Get, Request, Put } from "@nestjs/common";
import { VendorsService } from "./vendors.service";
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller("vendors")
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) { }

  @Post("register")
  async register(@Body() body: any) {
    try {
      await this.vendorsService.register(body);
      return { success: true, message: 'Vendor registered successfully' };
    } catch (error) {
      throw new BadRequestException(error.message || 'Registration failed');
    }
  }

  @Post("login")
  async login(
    @Body() body: { email: string; password: string }
  ) {
    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException("Email and password are required");
    }

    const result = await this.vendorsService.login(email, password);

    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return {
      success: true,
      vendor: result.vendor,
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('vendor')
  @Get("me")
  async getProfile(@Request() req) {
    const profile = await this.vendorsService.getProfile(req.user.userId);
    if (!profile) throw new BadRequestException('Vendor not found');
    return { success: true, data: profile };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('vendor')
  @Get("metrics")
  async getMetrics(@Request() req) {
    return this.vendorsService.getMetrics(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('vendor')
  @Put("update-profile")
  async updateProfile(@Request() req, @Body() body: any) {
    return this.vendorsService.updateProfile(req.user.userId, body);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('vendor')
  @Put("change-password")
  async changePassword(@Request() req, @Body() body: any) {
    try {
      return await this.vendorsService.changePassword(req.user.userId, body);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
