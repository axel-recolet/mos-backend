import { Injectable } from '@nestjs/common';
import { ForbiddenError } from '@casl/ability';
import { AbilityService } from '../ability/ability.service';
import { Action } from '../ability/action.enum';
import { IJtwUser } from '../auth/jwt.strategy';
import { CreateStorageDto } from './dto/storage.dto';
import { StorageDocument } from './repository/repository.interface';
import { StoragesRepository } from './repository/storages.repository';
import { IStorage } from './model';

@Injectable()
export class StoragesService {
  constructor(
    private readonly _storagesRepo: StoragesRepository,
    private readonly _abilityService: AbilityService,
  ) {}

  async findOneById(id: string): Promise<StorageDocument | null | undefined> {
    return await this._storagesRepo.findOneById(id);
  }

  async find(filter: Partial<StorageDocument>): Promise<StorageDocument[]> {
    return this._storagesRepo.find(filter);
  }

  async create(storage: CreateStorageDto, user: IJtwUser): Promise<IStorage> {
    try {
      const ability = this._abilityService.createForUser(user);
      console.log(ability.relevantRuleFor(Action.Create, storage));
      ForbiddenError.from(ability).throwUnlessCan(Action.Create, storage);
      const storageDoc = await this._storagesRepo.create(storage);
      return storageDoc;
    } catch (e) {
      throw e;
    }
  }
}
