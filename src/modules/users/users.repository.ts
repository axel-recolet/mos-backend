import { Injectable } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email } from 'src/utils/email.type';
import { SignupDto } from 'auth/dto';
import { UserEntity, UserDocument, CreditCardEntity } from './user.entity';
import { IUser } from './user.interface';
import { Depot } from '../depots';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly _usersRepo: Model<UserDocument>,
  ) {}

  async create(user: SignupDto): Promise<IUser> {
    try {
      const newUser = new this._usersRepo(user);
      await newUser.save();
      return newUser.toObject();
    } catch (error) {
      throw error;
    }
  }

  async updateCreditCard(
    id: string,
    creditCard: CreditCardEntity | undefined,
  ): Promise<IUser | undefined> {
    try {
      const result = await this._usersRepo.findOneAndUpdate(
        { id },
        { $set: { creditCard } },
        {
          runValidators: true,
          new: true,
        },
      );
      return result?.toObject();
    } catch (error) {
      throw error;
    }
  }

  async addDepot(id: string, depotId: string): Promise<IUser | undefined> {
    try {
      const result = await this._usersRepo.findOneAndUpdate(
        { id },
        { $addToSet: { depots: depotId } },
        {
          runValidators: true,
          new: true,
        },
      );
      return result?.toObject();
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: Email): Promise<IUser | undefined> {
    try {
      const user = await this._usersRepo.findOne({ email });
      return user?.toObject();
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<IUser | undefined> {
    try {
      const user = await this._usersRepo.findById(id).populate('depots');
      return user?.toObject();
    } catch (error) {
      throw error;
    }
  }
}
