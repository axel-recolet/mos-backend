import { IItem } from '../model/item.interface';

export type ItemDocument = IItem & { _id: string };

export interface IItemsRepository {
  findById(id: string): Promise<ItemDocument | undefined | null>;
}
