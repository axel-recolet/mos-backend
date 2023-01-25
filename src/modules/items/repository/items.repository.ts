import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IItem } from '../model/item.interface';
import { ItemDocument, Item } from './item.entity';
import { IItemsRepository } from './repository.interface';

export class ItemsRepository implements IItemsRepository {
  constructor(
    @InjectModel(Item.name)
    private readonly _itemsRepo: Model<ItemDocument>,
  ) {}

  async findById(id: string): Promise<IItem | undefined> {
    const _id = Number(id);
    if (isNaN(_id)) {
      throw new Error('Id have to be a number.');
    }
    const result = await this._itemsRepo.findById(
      new mongoose.Types.ObjectId(_id),
    );
    return result?.toObject({ versionKey: false });
  }
}
