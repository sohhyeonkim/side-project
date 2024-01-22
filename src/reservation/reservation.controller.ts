import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { AuthGuard } from '../guards/auth.guard';


@UseGuards(AuthGuard)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    try {
      return this.reservationService.reserve(createReservationDto);
    } catch (error) {
      throw error;
    }
  }
}