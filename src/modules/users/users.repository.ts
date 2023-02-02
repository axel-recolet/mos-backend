import { Injectable } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email } from 'src/utils/email.type';
import { SignupDto } from 'auth/dto';
import { UserEntity, UserDocument } from './user.entity';
import { IUser } from './user.interface';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly _usersRepo: Model<UserDocument>,
  ) {}

  async save(user: SignupDto): Promise<IUser> {
    try {
      const newUser = await new this._usersRepo(user);
      newUser.save();
      return newUser.toObject();
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
      const user = await this._usersRepo.findById(id);
      return user?.toObject();
    } catch (error) {
      throw error;
    }
  }
}
