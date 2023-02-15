import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { fakeUser } from 'users/user.fake';
import { UsersService } from 'users/users.service';
import { DepotsService } from 'depots/depots.service';
import { AuthService, EmailAlreadyUsed } from './auth.service';

jest.mock('../users/users.service');
jest.mock('../depots/depots.service');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  const email = 'lqdsjfh@dsljh.com';
  const pass = 'dsljfn';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService, DepotsService],
    }).compile();

    authService = moduleRef.get(AuthService);
    usersService = moduleRef.get(UsersService);
    jwtService = moduleRef.get(JwtService);
  });

  describe('validateUser', () => {
    it('Wrong password', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(
        fakeUser({
          email,
          password: 'aezraezraezr',
        }),
      );

      const result = authService.validateUser(email, pass);
      expect(result).resolves.toBeUndefined();
    });

    it("Email doesn't exist", async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(undefined);
      const result = authService.validateUser(email, pass);
      expect(result).resolves.toBeUndefined();
    });

    it("Doesn't return password", async () => {
      const user = fakeUser({
        email,
        password: pass,
      });
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);

      const result = await authService.validateUser(email, pass);
      expect(result).toMatchObject({
        id: user.id,
        email,
        depots: [],
      });
    });

    it('Handle Error', async () => {
      jest.spyOn(usersService, 'findByEmail').mockRejectedValue(undefined);
      const result = authService.validateUser(email, pass);
      expect(result).rejects.toBeUndefined();
    });
  });

  describe('login', () => {
    it('should return jwt', async () => {
      const user = fakeUser({
        email,
      });
      const jwtSignSpy = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValue('jhdsf');
      const result = await authService.login(user);

      expect(jwtSignSpy).toBeCalled();
      expect(result).toHaveProperty('access_token');
    });

    it('should throw when error', async () => {
      const user = fakeUser({
        email,
      });
      jest.spyOn(jwtService, 'sign').mockImplementation(() => {
        throw new Error();
      });
      const result = authService.login(user);

      expect(result).rejects.toThrowError();
    });
  });

  describe('register', () => {
    it('should throw EmailALreadyUsed When email is find', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValue(fakeUser({ email }));
      const result = authService.signup({ email, password: pass });
      expect(result).rejects.toThrow(EmailAlreadyUsed);
    });

    it('should create user and return void', async () => {
      const createUserDto = { email, password: pass };
      const createdUser = {
        id: faker.database.mongodbObjectId(),
        ...createUserDto,
        depots: [],
        creditCard: undefined,
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(undefined);

      const createUserMethod = jest
        .spyOn(usersService, 'create')
        .mockResolvedValue(createdUser);

      const result = await authService.signup(createUserDto);
      const resExpected = (() => {
        const { id, email, depots } = createdUser;
        return { id, email, depots };
      })();
      expect(result).toEqual(resExpected);
      expect(createUserMethod).toBeCalled();
      expect(createUserMethod).toHaveBeenCalledWith(createUserDto);
    });
  });
});
