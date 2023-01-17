import { Args, Query, Resolver } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './model/item.model';

@Resolver((of) => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Query((returns) => Item, { name: 'item', nullable: true })
  async getItem(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Item | undefined | null> {
    return this.itemsService.findOneById(id);
  }
}
