import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConflictException } from '@nestjs/common';
import { Role } from '../common/role.type';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  // 테스트 모듈 생성
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create a new user', () => {
    it('should throw ConflictExecption if email already exists', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName : 'test',
        lastName : 'test',
        role: Role.CUSTOMER,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({} as User);

      await expect(userService.create(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should save a new user if user creation is successful', async () => {
        const createUserDto = {
          email: 'test@example.com',
          password: 'password123',
          firstName : 'test',
          lastName : 'test',
          role: Role.CUSTOMER,
        };
        const newUser = new User();
        newUser.email = createUserDto.email;
        newUser.password = createUserDto.password;
        newUser.firstName = createUserDto.firstName;
        newUser.lastName = createUserDto.lastName;
  
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);
        jest.spyOn(userRepository, 'save').mockResolvedValueOnce(newUser)
        await expect(userService.create(createUserDto)).resolves.toEqual(newUser);
      });
  });

  describe('find user by email', () => {
    it('should find a user by email if exists', async () => {
      const userEmail = 'test@example.com';
      const user = new User();
      user.email = userEmail;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      const result = await userService.findOneByEmail(userEmail);

      expect(result.email).toEqual(userEmail);
    });

    it('should return undefined if email not exists', async () => {
        const userEmail = 'test@example.com';
          jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);
        const result = await userService.findOneByEmail(userEmail);
  
        expect(result).toBeUndefined();
      });
  });
});
