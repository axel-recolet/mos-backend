import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStoragesRepository, StorageDocument } from './repository.interface';
import { Storage } from '../repository/storage.schema';

@Injectable()
export class StoragesRepository implements IStoragesRepository {
  constructor(
    @InjectModel(Storage.name)
    private readonly _storagesRepo: Model<StorageDocument>,
  ) {}

  async findOneById(id: string): Promise<StorageDocument | undefined | null> {
    const model = await this._storagesRepo.findById(id);
    return model?.toObject({ versionKey: false });
  }

  async find(filter: Partial<StorageDocument>): Promise<StorageDocument[]> {
    const models = await this._storagesRepo.find(filter);
    return models.map((model) => model.toObject({ versionKey: false }));
  }
}
