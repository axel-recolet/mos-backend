import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStoragesRepository } from './repository.interface';
import { StorageDocument, StorageEntity } from './storage.entity';
import { CreateStorageDto } from '../dto/storage.dto';
import { IStorage } from '../storage.interface';

@Injectable()
export class StoragesRepository implements IStoragesRepository {
  constructor(
    @InjectModel(StorageEntity.name)
    private readonly _storagesRepo: Model<StorageDocument>,
  ) {}

  async findById(id: string): Promise<IStorage | undefined> {
    try {
      const model = await this._storagesRepo.findById(id);
      return model?.toObject({ versionKey: false });
    } catch (error) {
      throw error;
    }
  }

  async find(filter: Partial<IStorage>): Promise<IStorage[]> {
    try {
      const models = await this._storagesRepo.find(filter);
      return models.map((model) => model.toObject({ versionKey: false }));
    } catch (error) {
      throw error;
    }
  }

  async create(storage: CreateStorageDto): Promise<IStorage> {
    try {
      const model = new this._storagesRepo(storage);
      model.save();
      return model.toObject({ versionKey: false });
    } catch (error) {
      throw error;
    }
  }
}
