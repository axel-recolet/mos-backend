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
      await this._permission.createDepot(user);

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
      const depot = await this._depotsRepo.findById(depotId);
      if (!depot) return depot;

      // permission
      await this._permission.getDepot(user, depot);

      return depot;
    } catch (error) {
      throw error;
    }
  }

  // Update
  async changeName(
    depotId: string,
    name: string,
    user: IUser,
  ): Promise<IDepot> {
    try {
      const depot = await this._depotsRepo.findById(depotId);
      if (!depot) throw new ForbiddenException();

      // Permission
      await this._permission.changeName(user, depot);

      this._depotsRepo.changeName(depotId, name);

      return {
        ...depot,
        name,
      };
    } catch (error) {
      throw error;
    }
  }

  async addAdmins(
    depotId: string,
    emails: string[],
    user: IUser,
  ): Promise<IDepot> {
    try {
      const depot = await this._depotsRepo.findById(depotId);
      if (!depot) throw new ForbiddenException();

      // Permission
      await this._permission.addAdmins(user, depot);

      this._depotsRepo.addAdmins(depotId, emails);

      return {
        ...depot,
        admins: Array.from(new Set([...depot.admins, ...emails])),
      };
    } catch (error) {
      throw error;
    }
  }

  async removeAdmins(
    depotId: string,
    emails: string[],
    user: IUser,
  ): Promise<IDepot> {
    try {
      const depot = await this._depotsRepo.findById(depotId);
      if (!depot) throw new ForbiddenException();

      // Permission
      await this._permission.removeAdmins(user, depot);

      return (await this._depotsRepo.removeAdmins(depotId, emails, {
        returnOriginal: false,
      })) as IDepot;
    } catch (error) {
      throw error;
    }
  }

  async addUsers(
    depotId: string,
    emails: string[],
    user: IUser,
  ): Promise<IDepot> {
    try {
      const depot = await this._depotsRepo.findById(depotId);
      if (!depot) throw new ForbiddenException();

      // Permission
      await this._permission.addUsers(user, depot);

      const updatedDepot = await this._depotsRepo.addUsers(depotId, emails, {
        returnOriginal: false,
      });

      return updatedDepot as IDepot;
    } catch (error) {
      throw error;
    }
  }

  async removeUsers(
    depotId: string,
    emails: string[],
    user: IUser,
  ): Promise<IDepot> {
    try {
      const depot = await this._depotsRepo.findById(depotId);
      if (!depot) throw new ForbiddenException();

      // Permission
      await this._permission.removeUsers(user, depot);

      return (await this._depotsRepo.removeUsers(depotId, emails, {
        returnOriginal: false,
      })) as IDepot;
    } catch (error) {
      throw error;
    }
  }

  async isPremium(depot: IDepot) {
    return depot.dueDate.isAfter(moment());
  }
}
