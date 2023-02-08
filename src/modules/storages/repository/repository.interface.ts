import { IStorage } from '../storage.interface';

export interface IStoragesRepository {
  findById(id: string): Promise<IStorage | undefined>;
  find(filter: Partial<IStorage>): Promise<IStorage[]>;
}
