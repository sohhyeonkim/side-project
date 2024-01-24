import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { PartnerModule } from '../partner/partner.module';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../guards/auth.guard';

@Module({
  imports: [ 
    UserModule, 
    PartnerModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        publicKey: configService.get('JWT_PUBLIC_KEY'),
        privateKey: configService.get('JWT_PRIVATE_KEY'),
        signOptions: { algorithm: 'ES256', expiresIn: '3h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
  exports: [AuthService],
})
export class AuthModule {}