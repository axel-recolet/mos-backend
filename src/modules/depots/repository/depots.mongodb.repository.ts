import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DepotEntity as Depot } from './depot.entity';
import { DepotDocument } from './depot.entity';
import { IDepotsRepository } from './depotsRepository.interface';
import { CreateDepotDto } from '../dto';
import { IDepot } from '../depot.interface';

@Injectable()
export class DepotsRepository implements IDepotsRepository {
  constructor(
    @InjectModel(Depot.name)
    private readonly _depotsRepo: Model<DepotDocument>,
  ) {}

  async create(
    createDepotDto: CreateDepotDto & { creator: string },
  ): Promise<IDepot> {
    const depotEntity = new this._depotsRepo(createDepotDto);
    const result = await depotEntity.save();
    return result.toObject();
  }

  async findById(depotId: string): Promise<IDepot | undefined> {
    const depotEntity = await this._depotsRepo.findById(depotId);
    return depotEntity?.toObject();
  }

  // Update
  async addAdmins(depotId: string, adminIds: string[]): Promise<void> {
    await this._depotsRepo.findByIdAndUpdate(depotId, {
      $addToSet: { admins: adminIds },
    });
  }

  async addUsers(depotId: string, userIds: string[]): Promise<void> {
    await this._depotsRepo.findByIdAndDelete(depotId, {
      $addToSet: { users: userIds },
    });
  }
}
