import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { CreateTechnicianDto, UpdateTechnicianDto } from './technicians.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller()
export class TechniciansController {
    constructor(private readonly techniciansService: TechniciansService) { }

    @Post('technicians/register')
    publicRegister(@Body() dto: any) {
        return this.techniciansService.publicRegister(dto);
    }

    @Post('vendors/technicians')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('vendor')
    create(@Request() req, @Body() dto: CreateTechnicianDto) {
        return this.techniciansService.create(req.user.userId, dto);
    }

    @Get('vendors/technicians')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('vendor')
    findAll(@Request() req) {
        return this.techniciansService.findAll(req.user.userId);
    }

    @Get('vendors/technicians/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('vendor')
    findOne(@Request() req, @Param('id') id: string) {
        return this.techniciansService.findOne(req.user.userId, +id);
    }

    @Patch('vendors/technicians/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('vendor')
    update(@Request() req, @Param('id') id: string, @Body() dto: UpdateTechnicianDto) {
        return this.techniciansService.update(req.user.userId, +id, dto);
    }

    @Delete('vendors/technicians/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('vendor')
    remove(@Request() req, @Param('id') id: string) {
        return this.techniciansService.remove(req.user.userId, +id);
    }
}
