import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @Roles(Role.User)
    create(@Request() req, @Body() dto: CreateOrderDto) {
        return this.ordersService.create(req.user.id, dto);
    }

    @Get()
    @Roles(Role.Admin)
    findAll() {
        return this.ordersService.findAll();
    }

    @Get('my')
    findMyOrders(@Request() req) {
        const role = req.user.role;
        if (role === Role.User) return this.ordersService.findByUser(req.user.id);
        if (role === Role.Vendor) return this.ordersService.findByVendor(req.user.id);
        if (role === Role.Technician) return this.ordersService.findByTechnician(req.user.id);
        return [];
    }

    @Put(':id')
    update(@Request() req, @Param('id') id: string, @Body() dto: UpdateOrderDto) {
        return this.ordersService.update(+id, dto, req.user.role, req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(+id);
    }
}
