import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { isEmail } from 'class-validator';
import * as moment from 'moment';
import { UsersService } from 'users/users.service';
import { IJwtUser } from '../auth';
import { PermissionsService } from '../permissions/permissions.service';
import { IDepot } from './depot.interface';
import { Depot } from './depot.model';
import { CreateDepotDto } from './dto';
import { DepotsRepository } from './repository';

@Injectable()
export class DepotsService {
  constructor(
    private readonly _depotsRepo: DepotsRepository,
    private readonly _usersService: UsersService,
    private readonly _permissionsService: PermissionsService,
  ) {}

  async create(
    createDepotDto: CreateDepotDto & { creator: string },
    user: IJwtUser,
  ): Promise<IDepot> {
    try {
      await this._permissionsService.createDepot(user, createDepotDto);

      const result: IDepot = await (async () => {
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

        const result = {
          creator: creatorId,
          admins: Array.from(adminIds),
          users: Array.from(userIds),
          dueDate: moment().toISOString(),
          ...rest,
        };

        return await this._depotsRepo.create(result);
      })();

      return result;
    } catch (e) {
      throw e;
    }
  }
}
