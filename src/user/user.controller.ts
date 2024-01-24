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
    private readonly authService: AuthService
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

  @Post('login')
  async logIn(@Body() body: LoginUserDto, @Res() res: Response) {
    try {
      const user = await this.userService.verifyUser(body);
     
      const {accessToken}: Token = this.authService.createToken({id: user.id, email: user.email, role: user.role});
      res.setHeader('Authorization', `Bearer ${accessToken}`);
      res.status(200).send({accessToken});

      res.send('로그인 성공');
    }
    catch(err) {
      console.error(err);
      throw err;
    }
  }
}
