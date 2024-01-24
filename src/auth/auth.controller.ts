import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService  
  ) {}

  @Post('login')
  async signIn (@Body() body: LoginUserDto, @Res() res: Response) {
    try {
      const {accessToken} = await this.authService.login(body);

      res.setHeader('Authorization', `Bearer ${accessToken}`);
      res.status(200).send({accessToken});

    } catch(error) {
      console.error(error);
      throw error;
    }
  }
}
