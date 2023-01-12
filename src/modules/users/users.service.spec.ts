import { Test } from '@nestjs/testing';
import { CreateUserDto } from '../auth/dto';
import { userDocumentFake } from './user.fake';
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
      const createdUserDto: CreateUserDto = {
        email: 'qdsf.azer@yio.com',
        password: 'sdlkjnerpoihsfd',
      };
      const saveSpy = jest
        .spyOn(usersRepo, 'save')
        .mockResolvedValue(userDocumentFake(createdUserDto));
      const result = usersService.create(createdUserDto);
      expect(saveSpy).toBeCalled();
    });
  });
});
