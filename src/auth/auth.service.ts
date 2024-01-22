import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateTokenDto, Token } from './dto/create-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ){}
  createToken(payload: CreateTokenDto): Token {
    
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '3h'
    });

    return {
      accessToken,
    }
  }
}
