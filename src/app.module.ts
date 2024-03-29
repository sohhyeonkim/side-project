import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TourModule } from './tour/tour.module';
import { PartnerModule } from './partner/partner.module';
import { ReservationModule } from './reservation/reservation.module';
import { User } from './user/entities/user.entity';
import { Reservation } from './reservation/entities/reservation.entity';
import { Tour } from './tour/entities/tour.entity';
import { Partner } from './partner/entities/partner.entity';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`]
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Reservation, Tour, Partner],
      synchronize: false,
      logging: true,
  }),
    UserModule,
    TourModule,
    PartnerModule,
    ReservationModule,
    AuthModule,],
  controllers: [],
  providers: [],
})


export class AppModule {}
