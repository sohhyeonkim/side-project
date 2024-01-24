import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  private async findValidReservations(args :{tourId: number, reservedDate: string}) {
    const { tourId, reservedDate } = args;
    const reservations = await this.reservationRepository.createQueryBuilder('reservation')
      .where('reservation.tourId = :tourId', { tourId })
      .andWhere('reservation.isConfirmed = :isConfirmed', { isConfirmed: true })
      .andWhere('reservation.isCanceled = :isCanceled', { isCanceled: false })
      .andWhere('reservation.reservedDate = :reservedDate', { reservedDate })
      .getMany();

    return reservations;
  }

  private async findvalidReservationsCountargs(args:{tourId: number, reservedDate: string}) {
    const { tourId, reservedDate } = args;
    const reservationsCount = await this.reservationRepository.createQueryBuilder('reservation')
      .where('reservation.tourId = :tourId', { tourId })
      .andWhere('reservation.isConfirmed = :isConfirmed', { isConfirmed: true })
      .andWhere('reservation.isCanceled = :isCanceled', { isCanceled: false })
      .andWhere('reservation.reservedDate = :reservedDate', { reservedDate })
      .getCount();

    return reservationsCount;
  }

  async reserve(createReservationDto: CreateReservationDto) {
    const reservationsCount = await this.findvalidReservationsCountargs({tourId: createReservationDto.tourId, reservedDate: createReservationDto.reservedDate})
    
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

    if(reservation.isCanceled) {
      throw new BadRequestException('취소된 예약은 확정할 수 없습니다.');
    }

    reservation.isConfirmed = true;
    await this.reservationRepository.save(reservation);

    return 'reservation is confirmed';
  }

  async cancel(reservationId: number) {
    const reservation = await this.reservationRepository.findOne({
      where: {
        id: reservationId
      }
    });

    if(!reservation) {
      throw new NotFoundException('예약 정보가 유효하지 않습니다.');
    }

    if(reservation.isCanceled) {
      throw new ConflictException('이미 취소된 예약입니다.');
    }

    // 취소는 3일 전까지만 가능하다.
    const reservedDate = new Date(reservation.reservedDate);
    const today = new Date();
    const diff = reservedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    if(diffDays < 3) {
      throw new BadRequestException('예약 취소는 3일 전까지만 가능합니다.');
    }

    reservation.isCanceled = true;
    await this.reservationRepository.save(reservation);

    return 'reservation is canceled';
  }
}
