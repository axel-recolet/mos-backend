import { IItem } from '../model/item.interface';

export interface IItemsRepository {
  findById(id: string): Promise<IItem | undefined>;
}
