import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { VendorsService } from "./vendors.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";
import { FileInterceptor } from "@nestjs/platform-express";
import { UseInterceptors, UploadedFile } from "@nestjs/common";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("vendors")
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Post("upload-avatar")
  @UseInterceptors(FileInterceptor("avatar", {
    storage: diskStorage({
      destination: "./uploads/profiles",
      filename: (req: any, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `vendor-${req.user.id}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async uploadAvatar(@Request() req, @UploadedFile() file: any) {
    const avatarUrl = `/uploads/profiles/${file.filename}`;
    await this.vendorsService.updateProfile(req.user.id, { avatar: avatarUrl });
    return { url: avatarUrl };
  }

  @Post("register")
  register(@Body() body: any) {
    return this.vendorsService.register(body);
  }

  @Get("business-types")
  getBusinessTypes() {
    return this.vendorsService.getBusinessTypes();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Get("profile")
  getProfile(@Request() req) {
    return this.vendorsService.getProfile(req.user.id);
  }

  @Put("profile")
  updateProfile(@Request() req, @Body() body: any) {
    return this.vendorsService.updateProfile(req.user.id, body);
  }

  // --- Technician Management ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Post("technicians")
  createTechnician(@Request() req, @Body() body: any) {
    return this.vendorsService.createTechnician(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Get("technicians")
  getMyTechnicians(@Request() req) {
    return this.vendorsService.getMyTechnicians(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Put("technicians/:id/status")
  updateTechnicianStatus(@Request() req, @Param("id") id: number, @Body("status") status: string) {
    return this.vendorsService.updateTechnicianStatus(req.user.id, id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Put("technicians/:id/approve")
  approveTechnician(@Request() req, @Param("id") id: number) {
    return this.vendorsService.approveTechnician(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Put("technicians/:id/reject")
  rejectTechnician(@Request() req, @Param("id") id: number) {
    return this.vendorsService.rejectTechnician(req.user.id, id);
  }

  // --- Service Management ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Post("services")
  createService(@Request() req, @Body() body: any) {
    return this.vendorsService.createService(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Get("services")
  getMyServices(@Request() req) {
    return this.vendorsService.getMyServices(req.user.id);
  }

  // --- Order Management ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Get("stats")
  getStats(@Request() req) {
    return this.vendorsService.getStats(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Get("orders")
  getMyOrders(@Request() req) {
    return this.vendorsService.getServiceRequests(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Post("orders/:id/assign")
  assignTechnician(@Request() req, @Param("id") id: number, @Body("technicianId") technicianId: number) {
    return this.vendorsService.assignTechnician(req.user.id, id, technicianId);
  }
}
