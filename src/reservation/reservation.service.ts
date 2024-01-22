import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Tour } from '../tour/entities/tour.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Tour)
    private tourRepository: Repository<Tour>,
  ) {}

  async reserve(createReservationDto: CreateReservationDto) {
    const reservationsCount = await this.reservationRepository.createQueryBuilder('reservation')
      .where('reservation.tourId = :tourId', { tourId: createReservationDto.tourId })
      .andWhere('reservation.reservedDate = :reservedDate', { reservedDate: createReservationDto.reservedDate })
      .getCount();
    
    const reservation = new Reservation();
    const user = await this.userRepository.findOne({
      where: {
        id: createReservationDto.userId
      }
    });
    const tour = await this.tourRepository.findOne({
      where: {
        id: createReservationDto.tourId
      }
    });

    if(!user || !tour) {
      throw new NotFoundException('유저 및 투어 정보가 유효하지 않습니다.');
    }
    reservation.reservedDate = createReservationDto.reservedDate;
    reservation.tour = tour
    reservation.user = user;

    if(reservationsCount > 5) {
      reservation.isConfirmed = false;
    }

    await this.reservationRepository.save(reservation);

    return reservationsCount > 5 ? 'reservation is on the waiting list' : 'reservation is confirmed';
  }

  async confirm(reservationId: number) {
    const reservation = await this.reservationRepository.findOne({
      where: {
        id: reservationId
      }
    });

    if(!reservation) {
      throw new NotFoundException('예약 정보가 유효하지 않습니다.');
    }

    if(reservation.isConfirmed) {
      throw new ConflictException('이미 확정된 예약입니다.');
    }

    reservation.isConfirmed = true;
    await this.reservationRepository.save(reservation);

    return 'reservation is confirmed';
  }
}
