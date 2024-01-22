import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { User } from '../user/entities/user.entity';
import { Tour } from '../tour/entities/tour.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, User, Tour])],
  controllers: [ReservationController],
  providers: [ReservationService, JwtService],
})
export class ReservationModule {}
