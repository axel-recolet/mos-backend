import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { userFake } from 'users/user.fake';
import { IDepot } from './depot.interface';
import { DepotsService } from './depots.service';
import { DepotsRepository } from './repository';
import { CreateDepotDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'users/user.entity';
import { UsersService } from 'users/users.service';
import { IUser } from '../users';
import * as moment from 'moment';
import { IJwtUser } from '../auth';
import { DepotsPermission } from './depots.permission';

jest.mock('./repository');
jest.mock('users/users.service');

describe('DepotsService', () => {
  let depotsService: DepotsService;
  let depotsRepo: DepotsRepository;
  let usersService: UsersService;
  let permisService: DepotsPermission;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        DepotsService,
        DepotsRepository,
        UsersService,
        DepotsPermission,
      ],
    }).compile();

    depotsService = moduleRef.get(DepotsService);
    depotsRepo = moduleRef.get(DepotsRepository);
    usersService = moduleRef.get(UsersService);
    permisService = moduleRef.get(DepotsPermission);
  });

  describe('create', () => {
    let creator: IUser;
    let user: IJwtUser;
    let createDepotDto: CreateDepotDto;
    let depotEntity: IDepot;

    beforeEach(async () => {
      jest.clearAllMocks();

      creator = userFake({ id: faker.datatype.uuid() });

      user = {
        id: creator.id,
        email: creator.email,
        depots: creator.depots,
      };

      createDepotDto = plainToInstance(CreateDepotDto, {
        name: faker.company.name(),
        admins: [faker.internet.email()],
        users: [faker.internet.email()],
      });

      depotEntity = {
        id: faker.datatype.uuid(),
        ...createDepotDto,
        creator,
        admins: (() => {
          const result: UserEntity[] = [];
          for (const email of createDepotDto.admins) {
            result.push(userFake({ email }));
          }
          if (creator) result.push(creator);
          return result;
        })(),
        users: (() => {
          const result: UserEntity[] = [];
          for (const email of createDepotDto.users) {
            result.push(userFake({ email }));
          }
          return result;
        })(),
        dueDate: moment().add(1, 'months'),
      };
    });

    it('should create depot', async () => {
      const usersServiceFindByIdSpy = jest
        .spyOn(usersService, 'findById')
        .mockResolvedValue(creator);

      const usersServiceFindByEmailSpy = jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValueOnce(depotEntity.admins[0])
        .mockResolvedValueOnce(depotEntity.users[0]);

      const repoCreateSpy = jest
        .spyOn(depotsRepo, 'create')
        .mockResolvedValue(depotEntity);

      const permisServiceSpy = jest
        .spyOn(permisService, 'createDepot')
        .mockResolvedValue(true);

      const result = await depotsService.create(
        {
          creator: creator.id,
          ...createDepotDto,
        },
        user,
      );

      expect(usersServiceFindByIdSpy).toHaveBeenCalledWith(creator.id);
      expect(usersServiceFindByEmailSpy).toHaveBeenCalledTimes(2);
      expect(result).toEqual(depotEntity);
    });

    it("should throw Error when creator doesn't exist", async () => {
      const usersServiceFindByIdSpy = jest
        .spyOn(usersService, 'findById')
        .mockResolvedValue(undefined);

      const result = depotsService.create(
        {
          creator: creator.id,
          ...createDepotDto,
        },
        user,
      );

      expect(result).rejects.toThrow();
    });

    it('should not add admin when his Email not exists', async () => {
      const usersServiceFindByIdSpy = jest
        .spyOn(usersService, 'findById')
        .mockResolvedValue(creator);

      const usersServiceFindByEmailSpy = jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(depotEntity.users[0]);

      const repoCreateSpy = jest
        .spyOn(depotsRepo, 'create')
        .mockResolvedValue({ ...depotEntity, admins: [] });

      const UserPermisServiceSpy = jest
        .spyOn(permisService, 'createDepot')
        .mockResolvedValue(true);

      const depot: CreateDepotDto & { creator: string } = {
        creator: creator.id,
        ...createDepotDto,
      };

      const result = await depotsService.create(depot, user);

      expect(repoCreateSpy).toHaveBeenCalledWith({
        ...depot,
        admins: [creator.id],
        users: depotEntity.users.map((user) => user.id),
        dueDate: moment().toISOString(),
      });
    });
  });
});
