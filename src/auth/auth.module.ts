import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
