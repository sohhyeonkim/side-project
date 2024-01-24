import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { AuthService } from '../auth/auth.service';
import { Request, Response } from 'express';

@Controller('partner')
export class PartnerController {
  constructor(
    private readonly partnerService: PartnerService,
    private readonly authService: AuthService  
  ) {}

  @Post('signup')
  create(@Body() body: CreatePartnerDto) {
    return this.partnerService.create(body);
  }

  @Post('login')
  async login (@Body() body: CreatePartnerDto, @Res() res: Response) {
    try {
      const partner = await this.partnerService.verifyUser(body);
      const {accessToken} = this.authService.createToken({id: partner.id, email: partner.email, role: partner.role});

      res.setHeader('Authorization', `Bearer ${accessToken}`);
      res.status(200).send({accessToken});

      res.send('로그인 성공')
    } catch(error) {
      console.error(error);
      throw error;
    }
  }
}
