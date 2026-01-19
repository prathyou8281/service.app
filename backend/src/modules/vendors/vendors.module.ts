import { Module } from '@nestjs/common';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { DatabaseService } from '../../database/database.service';

@Module({
  controllers: [VendorsController],
  providers: [VendorsService, DatabaseService],
})
export class VendorsModule {}
