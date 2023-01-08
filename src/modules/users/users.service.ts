import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model, Types } from 'mongoose';
import { CreateUserDto } from '../auth/dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<
    LeanDocument<User> & {
      _id: Types.ObjectId;
    }
  > {
    const createdUser = new this.userModel(createUserDto);
    return (await createdUser.save()).toObject();
  }

  async findOneByEmail(
    email: string,
  ): Promise<(LeanDocument<User> & { _id: Types.ObjectId }) | undefined> {
    const user = await this.userModel.findOne({ email });
    return user?.toObject({ versionKey: false });
  }
}
