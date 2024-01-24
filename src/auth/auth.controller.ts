import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { Public } from '../decorators/public.decorator';
import { Role } from '../common/role.type';
import { Roles } from '../decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService  
  ) {}

  @Public()
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
