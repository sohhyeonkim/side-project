import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Public()
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
