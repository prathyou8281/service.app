import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './services.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller()
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    /* ================= VENDOR ROUTES ================= */
    @Post('vendors/services')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('vendor')
    create(@Request() req, @Body() dto: CreateServiceDto) {
        return this.servicesService.create(req.user.userId, dto);
    }

    @Get('vendors/services')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('vendor')
    findAllVendor(@Request() req) {
        return this.servicesService.findAllByVendor(req.user.userId);
    }

    @Patch('vendors/services/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('vendor')
    update(@Request() req, @Param('id') id: string, @Body() dto: UpdateServiceDto) {
        return this.servicesService.update(req.user.userId, +id, dto);
    }

    @Delete('vendors/services/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('vendor')
    remove(@Request() req, @Param('id') id: string) {
        return this.servicesService.remove(req.user.userId, +id);
    }

    @Get('services')
    findAll() {
        return this.servicesService.findAllActive();
    }

    @Get('services/unique')
    findUnique() {
        return this.servicesService.findUniqueServices();
    }

    @Get('services/by-name/:name')
    findByName(@Param('name') name: string) {
        return this.servicesService.findVendorsByServiceName(name);
    }

    @Get('services/:id')
    findOne(@Param('id') id: string) {
        return this.servicesService.findOnePublic(+id);
    }
}
