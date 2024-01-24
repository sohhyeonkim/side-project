import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../common/role.type';


@UseGuards(AuthGuard)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @Roles([Role.CUSTOMER, Role.ADMIN])
  create(@Body() createReservationDto: CreateReservationDto) {
    try {
      return this.reservationService.reserve(createReservationDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':reservationId')
  @Roles([Role.ADMIN, Role.PARTNER])
  update(@Param('reservationId') reservationId: string) {
    try{
      return this.reservationService.confirm(+reservationId);
    } catch (error) {
      throw error;
    }
  }
}