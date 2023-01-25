import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  ExtractSubjectType,
  MongoAbility,
} from '@casl/ability';
import { Item } from 'items/model/item.model';
import { Storage } from 'storages/model/storage.model';
import { User } from '../users/user.entity';
import { Action } from './action.enum';
import { Injectable } from '@nestjs/common';
import { IJtwUser } from '../auth/jwt.strategy';
import { IStorage } from '../storages/model';
import { CreateStorageDto } from '../storages/dto/storage.dto';

type StorageSubjects = typeof CreateStorageDto | CreateStorageDto;

// eslint-disable-next-line prettier/prettier
type Subjects = StorageSubjects | typeof Item | typeof User;

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class AbilityService {
  createForUser(user: IJtwUser) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility /*as CreateAbility<AppAbility>*/,
    );

    // vous ne pouvez pas changer un element
    // d'une depot qui n'est pas lié à l'utilisateur
    can(Action.Create, CreateStorageDto, {
      depotId: { $in: user.depots.map((e) => e.id) },
      /*[`depot._id`]: { $in: user.depotIds },*/
    }).because(`The depotId id unknown.`);

    /*
    can(Action.Create, CreateStorageDto, {
      [`permission.byUser.${user.userId}`]: {
        $in: [Action.Create],
      },
    });

    can(Action.Create, CreateStorageDto, {
      [`permission.byUser.${user.userId}`]: {
        $exists: false,
      },
      ['permission.default']: {
        $in: ['Create'],
      },
    });
    */

    return build({
      detectSubjectType: (item: object) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
