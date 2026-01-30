import { Module } from '@nestjs/common';
import { AdminController } from './admins.controller';
import { AdminService } from './admins.service';

@Module({
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminsModule { }
