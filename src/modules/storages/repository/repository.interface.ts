import { IStorage } from '../model/storage.interface';

export type StorageDocument = IStorage & { _id: string };

export interface IStoragesRepository {
  findOneById(id: string): Promise<StorageDocument | undefined | null>;
  find(filter: Partial<StorageDocument>): Promise<StorageDocument[]>;
}
