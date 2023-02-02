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
}
