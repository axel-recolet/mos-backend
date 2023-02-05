import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { isEmail } from 'class-validator';
import * as moment from 'moment';
import { UsersService, IUser } from 'users';
import { IJwtUser } from '../auth';
import { DepotsPermission } from './depots.permission';
import { IDepot } from './depot.interface';
import { CreateDepotDto } from './dto';
import { DepotsRepository } from './repository';

@Injectable()
export class DepotsService {
  constructor(
    private readonly _depotsRepo: DepotsRepository,
    private readonly _usersService: UsersService,
    private readonly _permission: DepotsPermission,
  ) {}

  async create(
    createDepotDto: CreateDepotDto & { creator: string },
    jwtUser: IJwtUser,
  ): Promise<IDepot> {
    try {
      // Permission
      await (async () => {
        const user = await this._usersService.findById(jwtUser.id);
        if (!user) throw new UnauthorizedException();
        const isAllow = await this._permission.createDepot(user);
        if (!isAllow) throw new ForbiddenException();
      })();

      const toId = async (idOrEmail: string): Promise<string | undefined> => {
        if (isEmail(idOrEmail)) {
          const user = await this._usersService.findByEmail(idOrEmail);
          return user?.id;
        } else {
          const user = await this._usersService.findById(idOrEmail);
          return user?.id;
        }
      };

      const { creator, admins, users, ...rest } = createDepotDto;

      const creatorId = await toId(creator);

      if (!creatorId) {
        throw Error(`${creator} doesn't exist.`);
      }

      const [adminIds, userIds] = await (async () => {
        const ids: Promise<string | undefined>[][] = [[], []];

        for (const admin of admins) {
          ids[0].push(toId(admin));
        }

        for (const user of users) {
          ids['1'].push(toId(user));
        }

        const toSetNotNull = (ids: (string | undefined)[]): Set<string> => {
          const setIds = new Set(ids);
          setIds.delete(undefined);
          return setIds as Set<string>;
        };

        return Promise.all([
          Promise.all(ids[0]).then(toSetNotNull),
          Promise.all(ids[1]).then(toSetNotNull),
        ]);
      })();

      adminIds.add(creator);

      const newDepot = {
        creator: creatorId,
        admins: Array.from(adminIds),
        users: Array.from(userIds),
        dueDate: moment().toISOString(),
        ...rest,
      };

      const result = await this._depotsRepo.create(newDepot);

      return result;
    } catch (e) {
      throw e;
    }
  }

  // Read
  async findById(depotId: string, user: IJwtUser): Promise<IDepot | undefined> {
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
    user: IJwtUser,
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
    user: IJwtUser,
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
