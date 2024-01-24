import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { comparePassword, hashPassword } from '../common/hash-password';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>){
  }
  
  async create(createUserDto: CreateUserDto) {
    let user = new User();
    const {password, ...rest} = createUserDto;
    const hassedPassword = await hashPassword(password);

    user = {...user, ...rest, password: hassedPassword };
    return this.userRepository.save(user);
  }

  async verifyUser(args: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {email: args.email}
    });
    if(!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    const isPasswordCorrect = await comparePassword(args.password, user.password);
    if(!isPasswordCorrect) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.')
    }
    return user;
  }
}
