import { Test } from '@nestjs/testing';
import { SignupDto } from '../auth/dto';
import { fakeUser } from './user.fake';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

jest.mock('./users.repository');

describe('UsersService', () => {
  let usersRepo: UsersRepository;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService, UsersRepository],
    }).compile();

    usersService = moduleRef.get(UsersService);
    usersRepo = moduleRef.get(UsersRepository);
  });

  describe('create', () => {
    it('should create new user', async () => {
      const createdUserDto: SignupDto = {
        email: 'qdsf.azer@yio.com',
        password: 'sdlkjnerpoihsfd',
      };
      const saveSpy = jest
        .spyOn(usersRepo, 'create')
        .mockResolvedValue(fakeUser(createdUserDto));

      const result = await usersService.create(createdUserDto);
      expect(saveSpy).toBeCalled();
    });
  });
});
