import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import * as classTransformer from 'class-transformer';
import { fakeUser } from 'users/user.fake';
import { IDepot } from './depot.interface';
import { DepotsService } from './depots.service';
import { DepotsRepository } from './repository';
import { CreateDepotDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { UsersService } from 'users/users.service';
import { IUser } from '../users';
import * as moment from 'moment';
import { DepotsPermission } from './depots.permission';
import { ValidationError } from 'class-validator';
import { ForbiddenException } from '@nestjs/common';

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
    let user: IUser;
    let createDepotDto: CreateDepotDto;

    beforeEach(async () => {
      user = fakeUser({ id: faker.datatype.uuid() });

      createDepotDto = plainToInstance(CreateDepotDto, {
        name: faker.company.name(),
        admins: [faker.internet.email()],
        users: [faker.internet.email()],
      });
    });

    // Instantiation
    it('should transform plain to instance of CreateDepotDto', async () => {
      const plainToInstanceSpy = jest.spyOn(
        classTransformer,
        'plainToInstance',
      );

      await depotsService.create({ ...createDepotDto }, user);

      expect(plainToInstanceSpy).toBeCalled();
    });

    // Validation
    it('should throw an error when argments is not validate', async () => {
      createDepotDto.admins.push(faker.name.firstName());

      const result = depotsService.create(createDepotDto, user);

      expect(result).rejects.toBeInstanceOf(Array<ValidationError>);
    });

    // Permission
    it('should throw an ForbiddenException when user is not allow to create depot', async () => {
      const permisSpy = jest
        .spyOn(permisService, 'createDepot')
        .mockResolvedValue(false);

      const result = depotsService.create(createDepotDto, user);

      await expect(result).rejects.toBeInstanceOf(ForbiddenException);
      expect(permisSpy).toHaveBeenCalled();
    });

    // All work
    it('should create depot', async () => {
      const depotEntity: IDepot = {
        id: faker.datatype.uuid(),
        ...createDepotDto,
        creator: user.id,
        dueDate: moment().add(1, 'months'),
      };

      jest.spyOn(permisService, 'createDepot').mockResolvedValue(true);
      jest.spyOn(depotsRepo, 'create').mockResolvedValue(depotEntity);

      const result = await depotsService.create(createDepotDto, user);

      expect(result).toEqual(depotEntity);
    });
  });

  describe('Name of the group', () => {});
});
