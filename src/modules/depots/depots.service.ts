import { Injectable, ForbiddenException } from '@nestjs/common';
import * as moment from 'moment';
import { UsersService, IUser } from 'users';
import { DepotsPermission } from './depots.permission';
import { IDepot } from './depot.interface';
import { CreateDepotDto } from './dto';
import { DepotsRepository } from './repository';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DepotsService {
  constructor(
    private readonly _depotsRepo: DepotsRepository,
    private readonly _usersService: UsersService,
    private readonly _permission: DepotsPermission,
  ) {}

  async create(createDepotDto: CreateDepotDto, user: IUser): Promise<IDepot> {
    try {
      // Instantiation
      if (!(createDepotDto instanceof CreateDepotDto)) {
        createDepotDto = plainToInstance(
          CreateDepotDto,
          createDepotDto as CreateDepotDto,
        );
      }

      // Validation
      await validateOrReject(createDepotDto);

      // Permission
      const isAllow = await this._permission.createDepot(user);
      if (!isAllow) throw new ForbiddenException();

      const newDepot = {
        creator: user.id,
        ...createDepotDto,
        dueDate: moment().add(1, 'months').toISOString(),
      };

      const result = await this._depotsRepo.create(newDepot);
      return result;
    } catch (e) {
      throw e;
    }
  }

  // Read
  async findById(depotId: string, user: IUser): Promise<IDepot | undefined> {
    try {
      // permission
      await (async () => {
        const isAllow = await this._permission.getDepot(user, depotId);
        if (!isAllow) throw new ForbiddenException();
      })();

      const depot = await this._depotsRepo.findById(depotId);

      return depot;
    } catch (error) {
      throw error;
    }
  }

  async addAdmins(
    depotId: string,
    adminIds: string[],
    user: IUser,
  ): Promise<void> {
    try {
      // Permission
      await (async () => {
        const depot = await this._depotsRepo.findById(depotId);
        if (!depot) throw new ForbiddenException();

        const isAllow = await this._permission.updateDepotAdmins(user, depot);
        if (!isAllow) throw new ForbiddenException();
      })();

      await this._depotsRepo.addAdmins(depotId, adminIds);
    } catch (error) {
      throw error;
    }
  }

  async addUsers(
    depotId: string,
    userIds: string[],
    user: IUser,
  ): Promise<void> {
    // Permission
    await (async () => {
      const depot = await this._depotsRepo.findById(depotId);
      if (!depot) throw new ForbiddenException();

      const isAllow = await this._permission.updateDepotUsers(user, depot);
      if (!isAllow) throw new ForbiddenException();
    })();

    await this._depotsRepo.addUsers(depotId, userIds);
  }

  async isPremium(depot: IDepot) {
    return depot.dueDate.isAfter(moment());
  }
}
