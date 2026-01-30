import { Module } from '@nestjs/common';
import { TechnicianController } from './technicians.controller';
import { TechniciansService } from './technicians.service';

@Module({
    controllers: [TechnicianController],
    providers: [TechniciansService],
})
export class TechniciansModule { }
