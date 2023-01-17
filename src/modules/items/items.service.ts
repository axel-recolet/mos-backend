import { Injectable } from '@nestjs/common';
import { ItemsRepository } from './repository';
import { Item } from './model/item.model';

@Injectable()
export class ItemsService {
  constructor(private readonly itemsRepo: ItemsRepository) {}

  async findOneById(id: string): Promise<Item | undefined | null> {
    const result = await this.itemsRepo.findById(id);
    if (!result) return;
    const { _id, ...rest } = result;
    return {
      id: _id,
      ...rest,
    };
  }
}
