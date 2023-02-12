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
import { ItemsService } from '../items/items.service';
import { Item } from '../items/model/item.model';
import { IUser } from '../users';
import { CreateStorageDto } from './dto/create.storage.dto';
import { IStorage } from './storage.interface';
import { Storage } from './storage.model';
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
  ): Promise<IStorage | undefined> {
    return this._storagesService.findById(id);
  }

  @Mutation((returns) => Storage, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async createStorage(@User() user: IUser, @Args() storage: CreateStorageDto) {
    try {
      return this._storagesService.create(storage, user);
    } catch (e) {
      throw e;
    }
  }

  @ResolveField('items', (returns) => [Item])
  async getItems(@Parent() storage: Storage) {
    const { id } = storage;
    return this._itemsService.findById(id);
  }
}
