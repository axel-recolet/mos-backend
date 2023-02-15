import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { DepotEntity as Depot } from './depot.entity';
import { DepotDocument } from './depot.entity';
import { IDepotsRepository } from './depotsRepository.interface';
import { CreateDepotDto } from '../dto';
import { IDepot } from '../depot.interface';
import { Email } from 'src/utils/email.type';

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
    try {
      const depotEntity = await this._depotsRepo.findById(depotId);
      return depotEntity?.toObject();
    } catch (error) {
      throw error;
    }
  }

  // Update
  async addAdmins(
    depotId: string,
    emails: Email[],
    options?: QueryOptions,
  ): Promise<void> {
    try {
      await this._depotsRepo.findByIdAndUpdate(
        depotId,
        {
          $addToSet: { admins: emails },
        },
        options,
      );
    } catch (error) {
      throw error;
    }
  }

  async removeAdmins(
    depotId: string,
    emails: Email[],
    options?: QueryOptions,
  ): Promise<IDepot | undefined> {
    try {
      const depotEntity = await this._depotsRepo.findByIdAndUpdate(
        depotId,
        {
          $pullAll: { admins: emails },
        },
        options,
      );
      return depotEntity?.toObject();
    } catch (error) {
      throw error;
    }
  }

  async addUsers(
    depotId: string,
    emails: Email[],
    options?: QueryOptions,
  ): Promise<IDepot | undefined> {
    try {
      const depotEntity = await this._depotsRepo.findByIdAndUpdate(
        depotId,
        {
          $addToSet: { users: emails },
        },
        options,
      );
      return depotEntity?.toObject();
    } catch (error) {
      throw error;
    }
  }

  async removeUsers(
    depotId: string,
    emails: Email[],
    options?: QueryOptions,
  ): Promise<IDepot | undefined> {
    try {
      const depotEntity = await this._depotsRepo.findByIdAndUpdate(
        depotId,
        {
          $pullAll: { users: emails },
        },
        options,
      );
      return depotEntity?.toObject();
    } catch (error) {
      throw error;
    }
  }

  async changeName(depotId: string, name: string, options?: QueryOptions) {
    try {
      await this._depotsRepo.findByIdAndUpdate(
        depotId,
        {
          name,
        },
        options,
      );
    } catch (error) {
      throw error;
    }
  }
}
