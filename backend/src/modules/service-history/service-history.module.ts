import { Module } from '@nestjs/common';
import { ServiceHistoryService } from './service-history.service';
import { ServiceHistoryController } from './service-history.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [ServiceHistoryController],
    providers: [ServiceHistoryService],
})
export class ServiceHistoryModule { }
