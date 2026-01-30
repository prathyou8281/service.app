import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
} from "@nestjs/common";
import { AdminService } from "./admins.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";

@Controller("admins")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin) // Strict global guard for this controller
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get("profile")
    getProfile(@Request() req) {
        return this.adminService.getProfile(req.user.id);
    }

    @Put("profile")
    updateProfile(@Request() req, @Body() dto: UpdateAdminDto) {
        return this.adminService.updateProfile(req.user.id, dto);
    }

    // Oversight
    @Get("metrics")
    getMetrics() {
        return this.adminService.getMetrics();
    }

    // Manage Admins
    @Post("create")
    createAdmin(@Body() dto: CreateAdminDto) {
        return this.adminService.createAdmin(dto);
    }

    // Universal User Management
    @Get("users/:role")
    getAllUsers(@Param("role") role: string) {
        return this.adminService.getAllUsersByRole(role);
    }

    @Put("users/:role/:id/status")
    updateUserStatus(
        @Param("role") role: string,
        @Param("id") id: number,
        @Body("status") status: string
    ) {
        const tableMap = { user: 'users', vendor: 'vendors', technician: 'technicians', admin: 'admins', services: 'services' };
        return this.adminService.updateStatus(tableMap[role], id, status);
    }

    @Put("users/:role/:id")
    updateUser(
        @Param("role") role: string,
        @Param("id") id: number,
        @Body() data: any
    ) {
        return this.adminService.updateUser(role, id, data);
    }

    @Delete("users/:role/:id")
    deleteUser(
        @Param("role") role: string,
        @Param("id") id: number
    ) {
        return this.adminService.deleteUser(role, id);
    }

    // Oversight
    @Get("services")
    getAllServices() {
        return this.adminService.getAllServices();
    }

    @Get("orders")
    getAllOrders() {
        return this.adminService.getAllOrders();
    }

    @Get("notifications")
    getNotifications() {
        return this.adminService.getNotifications();
    }

    @Put("notifications/:id/read")
    markNotificationRead(@Param("id") id: number) {
        return this.adminService.markNotificationRead(id);
    }
}
