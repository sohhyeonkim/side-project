import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './entities/partner.entity';
import { comparePassword, hashPassword } from '../common/hash-password';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
  ){}


  async create(createPartnerDto: CreatePartnerDto) {
    let partner = new Partner();
    const {password, ...rest} = createPartnerDto;

    const isPartnerExists = await this.partnerRepository.findOne({
      where: {countryCode: createPartnerDto.countryCode, phoneNumber: createPartnerDto.phoneNumber}
    });

    if(isPartnerExists) {
      throw new ConflictException('이미 가입된 파트너입니다.');
    };

    const hashedPassword = await hashPassword(password);
    partner = {...partner, ...rest, password: hashedPassword };

    return this.partnerRepository.save(partner);
  }

  async findOneByEmail(email: string){
    const partner = await this.partnerRepository.findOne({
      where: {email}
    });

    return partner;
  }
}
