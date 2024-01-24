import { Controller, Post, Body, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { Token } from '../auth/dto/create-token.dto';
import { Request, Response } from 'express';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  signIn(@Body() body: CreateUserDto) {
    try {
      return this.userService.create(body);
    } catch(err) {
      console.error(err);
      throw err;
    }
  }
}
