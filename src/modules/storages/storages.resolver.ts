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
import { Storage } from './model/storage.model';
import { StorageDocument } from './repository/repository.interface';
import { StoragesService } from './storages.service';

@Resolver((of) => Storage)
export class StoragesResolver {
  constructor(private storagesService: StoragesService) {}

  @Query((returns) => Storage, { name: 'storage', nullable: true })
  @UseGuards(GqlAuthGuard)
  async getStorage(
    @User() user: any,
    @Args('id', { type: () => String }) id: string,
  ): Promise<StorageDocument | undefined | null> {
    return this.storagesService.findOneById(id);
  }

  @Mutation((returns) => Storage)
  @UseGuards(GqlAuthGuard)
  async createStorage() {}

  // @ResolveField('items', return => [Item])
  // async getItems(@Parent() storage: Storage) {
  //   const { id } = storage;
  //   return this.itemsService.find({ id });
  // }
}
