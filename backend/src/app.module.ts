import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { VendorsModule } from './modules/vendors/vendors.module';
import { AuthModule } from './auth/auth.module';
import { TechniciansModule } from './modules/technicians/technicians.module';
import { ServicesModule } from './modules/services/services.module';
import { ServiceHistoryModule } from './modules/service-history/service-history.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    VendorsModule,
    AuthModule,
    TechniciansModule,
    ServicesModule,
    ServiceHistoryModule,
    AdminModule,
  ],
})
export class AppModule { }
