import { Injectable } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email } from 'src/utils/email.type';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly usersRepo: Model<UserDocument>,
  ) {}

  async save(user: User) {
    const newUser = await new this.usersRepo(user);
    newUser.save();
    return newUser.toObject();
  }

  async findByEmail(email: Email) {
    const user = await this.usersRepo.findOne({ email });
    return user?.toObject({ versionKey: false });
  }
}
