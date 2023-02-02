import { Injectable } from '@nestjs/common';
import { ItemsRepository } from './repository';
import { IItem } from './model/item.interface';

@Injectable()
export class ItemsService {
  constructor(private readonly itemsRepo: ItemsRepository) {}

  async findById(id: string): Promise<IItem | undefined> {
    try {
      const itemEntity = await this.itemsRepo.findById(id);
      return itemEntity;
    } catch (e) {
      throw e;
    }
  }
}
