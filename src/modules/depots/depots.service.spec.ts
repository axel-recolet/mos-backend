import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { userFake } from 'users/user.fake';
import { IDepot } from './depot.interface';
import { DepotsService } from './depots.service';
import { DepotsRepository } from './repository';
import { CreateDepotDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { User } from 'users/user.entity';
import { UsersService } from 'users/users.service';

jest.mock('./repository');
jest.mock('users/users.service');

describe('DepotsService', () => {
  let depotsService: DepotsService;
  let depotsRepo: DepotsRepository;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DepotsService, DepotsRepository, UsersService],
    }).compile();

    depotsService = moduleRef.get(DepotsService);
    depotsRepo = moduleRef.get(DepotsRepository);
    usersService = moduleRef.get(UsersService);
  });

  describe('create', () => {
    let creator: string;
    let createDepotDto: CreateDepotDto;
    let depotEntity: IDepot;

    beforeEach(async () => {
      creator = faker.datatype.uuid();

      createDepotDto = plainToInstance(CreateDepotDto, {
        name: faker.company.name(),
        admins: [faker.internet.email()],
        users: [faker.internet.email()],
      });

      depotEntity = {
        id: faker.datatype.uuid(),
        ...createDepotDto,
        admins: (() => {
          const result: User[] = [];
          for (const email of createDepotDto.admins) {
            result.push(userFake({ email }));
          }
          if (creator) result.push(userFake({ id: creator }));
          return result;
        })(),
        users: (() => {
          const result: User[] = [];
          for (const email of createDepotDto.users) {
            result.push(userFake({ email }));
          }
          return result;
        })(),
      };
    });

    it('should create depot', async () => {
      const usersServiceFindByIdSpy = jest
        .spyOn(usersService, 'findById')
        .mockResolvedValue(userFake({ id: creator }));

      const usersServiceFindByEmailSpy = jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValueOnce(depotEntity.admins[0])
        .mockResolvedValueOnce(depotEntity.users[0]);

      const repoCreateSpy = jest
        .spyOn(depotsRepo, 'create')
        .mockResolvedValue(depotEntity);

      const result = await depotsService.create({
        creator,
        ...createDepotDto,
      });

      expect(usersServiceFindByIdSpy).toHaveBeenCalledWith(creator);
      expect(usersServiceFindByEmailSpy).toHaveBeenCalledTimes(2);
      expect(result).toEqual(depotEntity);
    });

    it("should throw Error when creator doesn't exist", async () => {
      const usersServiceFindByIdSpy = jest
        .spyOn(usersService, 'findById')
        .mockResolvedValue(undefined);

      const result = depotsService.create({
        creator,
        ...createDepotDto,
      });

      expect(result).rejects.toThrow();
    });

    it('should not add admin when his Email not exists', async () => {
      const usersServiceFindByIdSpy = jest
        .spyOn(usersService, 'findById')
        .mockResolvedValue(userFake({ id: creator }));

      const usersServiceFindByEmailSpy = jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(depotEntity.users[0]);

      const repoCreateSpy = jest
        .spyOn(depotsRepo, 'create')
        .mockResolvedValue({ ...depotEntity, admins: [] });

      const depot: CreateDepotDto & { creator: string } = {
        creator,
        ...createDepotDto,
      };

      const result = await depotsService.create(depot);

      expect(repoCreateSpy).toHaveBeenCalledWith({
        ...depot,
        admins: [creator],
        users: depotEntity.users.map((user) => user.id),
      });
    });
  });
});
