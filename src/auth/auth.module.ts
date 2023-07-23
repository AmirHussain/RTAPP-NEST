
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
require('dotenv').config();

@Module({
  controllers: [AuthController],
  providers: [AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }],
  imports:[UsersModule,
    JwtModule.register({
      global: true,
      secret:process.env.SECRET,
      signOptions: { expiresIn: '3600s' },
    }),]
})
export class AuthModule {}
