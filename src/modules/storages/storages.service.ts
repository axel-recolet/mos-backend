import { Injectable } from '@nestjs/common';
import { IJwtUser } from '../auth/jwt.strategy';
import { CreateStorageDto } from './dto/storage.dto';
import { StoragesRepository } from './repository/storages.mongodb.repository';
import { IStorage } from './storage.interface';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class StoragesService {
  constructor(
    private readonly _storagesRepo: StoragesRepository,
    private readonly _permisService: PermissionsService,
  ) {}

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

  async create(storage: CreateStorageDto, user: IJwtUser): Promise<IStorage> {
    try {
      //const ability = this._permisService.from(user);
      const storageDoc = await this._storagesRepo.create(storage);
      return storageDoc;
    } catch (error) {
      throw error;
    }
  }
}
