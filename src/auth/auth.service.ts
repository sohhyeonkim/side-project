import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateTokenDto, Token, VerifiedToken } from './dto/create-token.dto';
import { UserService } from '../user/user.service';
import { PartnerService } from '../partner/partner.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { Role } from '../common/role.type';
import { comparePassword, hashPassword } from '../common/hash-password';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly partnerService: PartnerService,
    private readonly jwtService: JwtService,
  ){}
   async login (payload: LoginUserDto): Promise<Token> {
    
    const found = payload.role === Role.CUSTOMER ? await this.userService.findOneByEmail(payload.email) : await this.partnerService.findOneByEmail(payload.email);
    if(!found) {
      throw new UnauthorizedException('로그인 정보가 일치하지 않습니다.');
    }

    const isValidPassword = await comparePassword(payload.password, found.password);
    if(!isValidPassword) {
      throw new UnauthorizedException('로그인 정보가 일치하지 않습니다.');
    }

    return {
      accessToken: await this.jwtService.signAsync(payload)
    }
  }
}
