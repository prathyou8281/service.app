import { Controller, Get, Post, Put, Delete, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('me')
    getMe(@Req() req: any) {
        return this.adminService.getEntities('admins'); // Just to reuse, or better:
    }

    @Put('update-profile')
    updateProfile(@Req() req: any, @Body() body: any) {
        return this.adminService.updateAdminProfile(req.user.userId, body);
    }

    @Put('change-password')
    changePassword(@Req() req: any, @Body() body: any) {
        return this.adminService.changeAdminPassword(req.user.userId, body);
    }

    @Get('metrics')
    getMetrics() {
        return this.adminService.getMetrics();
    }

    @Get('users')
    getUsers() {
        return this.adminService.getEntities('users');
    }

    @Get('vendors')
    getVendors() {
        return this.adminService.getEntities('vendors');
    }

    @Get('technicians')
    getTechnicians() {
        return this.adminService.getEntities('technicians');
    }

    @Post('users')
    createUser(@Body() body: any) { return this.adminService.createEntity('users', body); }

    @Post('vendors')
    createVendor(@Body() body: any) { return this.adminService.createEntity('vendors', body); }

    @Post('technicians')
    createTech(@Body() body: any) { return this.adminService.createEntity('technicians', body); }

    @Put('users')
    updateUser(@Body() body: any) { return this.adminService.updateEntity('users', body); }

    @Put('vendors')
    updateVendor(@Body() body: any) { return this.adminService.updateEntity('vendors', body); }

    @Put('technicians')
    updateTech(@Body() body: any) { return this.adminService.updateEntity('technicians', body); }

    @Delete('users')
    deleteUser(@Query('id') id: number) { return this.adminService.deleteEntity('users', id); }

    @Delete('vendors')
    deleteVendor(@Query('id') id: number) { return this.adminService.deleteEntity('vendors', id); }

    @Delete('technicians')
    deleteTech(@Query('id') id: number) { return this.adminService.deleteEntity('technicians', id); }

    @Get('pending-vendors')
    getPendingVendors() {
        return this.adminService.getPendingVendors();
    }

    @Put('vendors/status')
    verifyVendor(@Body() body: { id: number, status: 'active' | 'rejected' }) {
        return this.adminService.verifyVendor(body.id, body.status);
    }
}
