import { ForbiddenException, Injectable } from '@nestjs/common';
import { IUser } from '../users';
import { CreateStorageDto, UpdateStorageDto } from './dto';
import { StoragesRepository } from './repository/storages.mongodb.repository';
import { IStorage } from './storage.interface';
import { StoragesPermission } from './storages.permission';

@Injectable()
export class StoragesService {
  constructor(
    private readonly _storagesRepo: StoragesRepository,
    private readonly _permission: StoragesPermission,
  ) {}

  // Create
  async create(storage: CreateStorageDto, user: IUser): Promise<IStorage> {
    try {
      const storageDoc = await this._storagesRepo.create(storage);
      return storageDoc;
    } catch (error) {
      throw error;
    }
  }

  // Read
  async findById(id: string): Promise<IStorage | undefined> {
    try {
      return await this._storagesRepo.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async find(filter: Partial<IStorage>): Promise<IStorage[]> {
    try {
      return this._storagesRepo.find(filter);
    } catch (error) {
      throw error;
    }
  }

  // Update
  async update(updateStorage: UpdateStorageDto, user: IUser) {
    try {
      // Permission
      const isAllow = await this._permission.updateStorage(user, updateStorage);
      if (!isAllow) throw new ForbiddenException();

      for (const field of Object.keys(updateStorage)) {
        if (field === undefined) delete updateStorage[field];
      }

      await this._storagesRepo.update(updateStorage);
    } catch (error) {
      throw error;
    }
  }

  // Delete
}
