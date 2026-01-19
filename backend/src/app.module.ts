import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { VendorsModule } from './modules/vendors/vendors.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    VendorsModule, // ✅ REQUIRED
    AuthModule,
  ],
})
export class AppModule { }
