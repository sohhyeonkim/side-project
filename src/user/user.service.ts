import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

    const isUserExists = await this.userRepository.findOne({
      where: {email: createUserDto.email}
    });

    if(isUserExists) {
      throw new ConflictException('이미 가입된 유저입니다.');
    }
    
    user = {...user, ...rest, password: hassedPassword };
    return this.userRepository.save(user);
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {email}
    });

    return user;
  }
}
