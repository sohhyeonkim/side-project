import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PartnerService } from '../partner/partner.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { Role } from '../common/role.type';
import { User } from '../user/entities/user.entity';
import { comparePassword } from '../common/hash-password';

jest.mock('../common/hash-password');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let partnerService: PartnerService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: PartnerService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    partnerService = module.get<PartnerService>(PartnerService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('/auth/login', () => {
    it('should throw UnauthorizedException if user/partner is not found', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);

      const payload: LoginUserDto = {
        email: 'nonexistent@example.com',
        password: 'somepassword',
        role: Role.CUSTOMER,
      };

      await expect(service.login(payload)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const user = new User();
      const foundUser = { ...user, email: 'existing@example.com', password: 'hashedpassword', role: Role.CUSTOMER};
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(foundUser);
      (comparePassword as jest.Mock).mockResolvedValue(Promise.resolve(false));
      
      const payload: LoginUserDto = {
        email: 'existing@example.com',
        password: 'invalidpassword',
        role: Role.CUSTOMER,
      };

      await expect(service.login(payload)).rejects.toThrow(UnauthorizedException);
    });

    it('should return an access token if login is successful', async () => {
      const user = new User();
      const foundUser = { ...user, email: 'existing@example.com', password: 'validpassword', role: Role.CUSTOMER};
      const mockedAccessToken = 'mockedAccessToken';
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(foundUser);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockedAccessToken);
      (comparePassword as jest.Mock).mockResolvedValue(Promise.resolve(true));

      const payload: LoginUserDto = {
        email: 'existing@example.com',
        password: 'validpassword',
        role: Role.CUSTOMER,
      };

      const result = await service.login(payload);

      expect(result).toEqual({ accessToken: mockedAccessToken });
    });
  });
});
