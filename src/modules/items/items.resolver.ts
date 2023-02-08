import { Args, Query, Resolver } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { IItem } from './model/item.interface';
import { Item } from './model/item.model';

@Resolver((of) => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Query((returns) => Item, { name: 'item', nullable: true })
  async getItem(
    @Args('id', { type: () => String }) id: string,
  ): Promise<IItem | undefined> {
    return this.itemsService.findById(id);
  }
}
