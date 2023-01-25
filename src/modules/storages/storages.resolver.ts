import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GqlAuthGuard } from 'auth/gql-jwt-auth.guard';
import { User } from 'utils/user.decorator';
import { IJtwUser } from '../auth/jwt.strategy';
import { ItemsService } from '../items/items.service';
import { Item } from '../items/model/item.model';
import { CreateStorageDto } from './dto/storage.dto';
import { Storage } from './model/storage.model';
import { StorageDocument } from './repository/repository.interface';
import { StoragesService } from './storages.service';

@Resolver((of) => Storage)
export class StoragesResolver {
  constructor(
    private readonly _storagesService: StoragesService,
    private readonly _itemsService: ItemsService,
  ) {}

  @Query((returns) => Storage, { name: 'storage', nullable: true })
  @UseGuards(GqlAuthGuard)
  async getStorage(
    @User() user: any,
    @Args('id', { type: () => String }) id: string,
  ): Promise<StorageDocument | undefined | null> {
    return this._storagesService.findOneById(id);
  }

  @Mutation((returns) => Storage, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async createStorage(
    @User() user: IJtwUser,
    @Args() storage: CreateStorageDto,
  ) {
    try {
      return this._storagesService.create(storage, user);
    } catch (e) {
      throw e;
    }
  }

  @ResolveField('items', (returns) => [Item])
  async getItems(@Parent() storage: Storage) {
    const { id } = storage;
    return this._itemsService.findOneById(id);
  }
}
