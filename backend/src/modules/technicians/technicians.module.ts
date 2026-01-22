import { Module } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { TechniciansController } from './technicians.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [TechniciansController],
    providers: [TechniciansService],
})
export class TechniciansModule { }
