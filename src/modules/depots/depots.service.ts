import { Injectable } from '@nestjs/common';
import { isEmail } from 'class-validator';
import { UsersService } from 'users/users.service';
import { Depot } from './depot.model';
import { CreateDepotDto } from './dto';
import { DepotsRepository } from './repository';

@Injectable()
export class DepotsService {
  constructor(
    private readonly _depotsRepo: DepotsRepository,
    private readonly _usersService: UsersService,
  ) {}

  async create(
    createDepotDto: CreateDepotDto & { creator: string },
  ): Promise<Depot> {
    try {
      const result = await (async () => {
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

        return {
          creator: creatorId,
          admins: Array.from(adminIds),
          users: Array.from(userIds),
          ...rest,
        };
      })();

      return await this._depotsRepo.create(result);
    } catch (e) {
      throw e;
    }
  }
}
