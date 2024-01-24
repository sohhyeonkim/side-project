import { Controller, Post, Body } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';


@Controller('partner')
export class PartnerController {
  constructor(
    private readonly partnerService: PartnerService,
  ) {}

  @Post('signup')
  create(@Body() body: CreatePartnerDto) {
    return this.partnerService.create(body);
  }
}
