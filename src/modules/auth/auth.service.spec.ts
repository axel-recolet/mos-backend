import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import mongoose from 'mongoose';
import { userDocumentFake } from '../users/user.fake';
import { UsersService } from '../users/users.service';
import { AuthService, EmailAlreadyUsed } from './auth.service';

jest.mock('../users/users.service');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  const email = 'lqdsjfh@dsljh.com';
  const pass = 'dsljfn';

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      imports: [PassportModule],
      providers: [AuthService, UsersService, JwtService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    usersService = moduleRef.get(UsersService);
    jwtService = moduleRef.get(JwtService);
  });

  describe('validateUser', () => {
    it('Wrong password', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(
        userDocumentFake({
          email,
          password: 'aezraezraezr',
        }),
      );

      const result = authService.validateUser(email, pass);
      expect(result).resolves.toBeUndefined();
    });

    it("Email doesn't exist", async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      const result = authService.validateUser(email, pass);
      expect(result).resolves.toBeUndefined();
    });
  });

  describe('login', () => {
    it('should return jwt', async () => {
      const user = { email, _id: new mongoose.Types.ObjectId().toString() };
      const jwtSignSpy = jest
        .spyOn(jwtService, 'sign')
        .mockImplementation(() => 'jhdsf');
      const result = await authService.login(user);

      expect(jwtSignSpy).toBeCalled();
      expect(result).toHaveProperty('access_token');
    });
  });

  describe('register', () => {
    it('should throw EmailALreadyUsed When email is find', async () => {
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(userDocumentFake({ email }));
      const result = authService.register({ email, password: pass });
      expect(result).rejects.toThrow(EmailAlreadyUsed);
    });

    it('should create user and return void', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(undefined);
      const createUserMethod = jest.spyOn(usersService, 'create');
      const createUserDto = { email, password: pass };
      const result = authService.register(createUserDto);
      await expect(result).resolves.toBeUndefined();
      expect(createUserMethod).toBeCalled();
      expect(createUserMethod).toHaveBeenCalledWith(createUserDto);
    });
  });
});
