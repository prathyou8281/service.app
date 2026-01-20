import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ServiceHistoryService } from './service-history.service';
import { CreateBookingDto, AssignTechnicianDto, UpdateJobStatusDto } from './service-history.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ServiceHistoryController {
    constructor(private readonly historyService: ServiceHistoryService) { }

    /* ================= USER ROUTES ================= */
    @Post('services/book')
    @Roles('user')
    book(@Request() req, @Body() dto: CreateBookingDto) {
        return this.historyService.create(req.user.userId, dto);
    }

    @Get('users/bookings')
    @Roles('user')
    getUserBookings(@Request() req) {
        return this.historyService.findByUser(req.user.userId);
    }

    /* ================= VENDOR ROUTES ================= */
    @Get('vendors/bookings')
    @Roles('vendor')
    getVendorBookings(@Request() req) {
        return this.historyService.findByVendor(req.user.userId);
    }

    @Patch('vendors/bookings/:id/assign')
    @Roles('vendor')
    assign(@Request() req, @Param('id') id: string, @Body() dto: AssignTechnicianDto) {
        return this.historyService.assignTechnician(req.user.userId, +id, dto);
    }

    /* ================= TECHNICIAN ROUTES ================= */
    @Get('technicians/jobs')
    @Roles('technician')
    getTechnicianJobs(@Request() req) {
        return this.historyService.findByTechnician(req.user.userId);
    }

    @Patch('technicians/jobs/:id')
    @Roles('technician')
    updateJob(@Request() req, @Param('id') id: string, @Body() dto: UpdateJobStatusDto) {
        return this.historyService.updateStatus(req.user.userId, +id, dto);
    }
}
