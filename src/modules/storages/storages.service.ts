import { Injectable } from '@nestjs/common';
import { StorageDocument } from './repository/repository.interface';
import { StoragesRepository } from './repository/storages.repository';

@Injectable()
export class StoragesService {
  constructor(private readonly storagesRepo: StoragesRepository) {}

  async findOneById(id: string): Promise<StorageDocument | null | undefined> {
    return await this.storagesRepo.findOneById(id);
  }

  async find(filter: Partial<StorageDocument>): Promise<StorageDocument[]> {
    return this.find(filter);
  }
}
