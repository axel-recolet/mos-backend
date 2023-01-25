import { Injectable } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email } from 'src/utils/email.type';
import { SignupDto } from 'auth/dto';
import { User, UserDocument } from './user.entity';
import { IUser } from './user.interface';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly _usersRepo: Model<UserDocument>,
  ) {}

  async save(user: SignupDto): Promise<IUser> {
    const newUser = await new this._usersRepo(user);
    newUser.save();
    return newUser.toObject();
  }

  async findByEmail(email: Email) {
    const user = await this._usersRepo.findOne({ email });
    return user?.toObject({ versionKey: false });
  }

  async findById(id: string) {
    const user = await this._usersRepo.findById(id);
    return user?.toObject({ versionKey: false });
  }
}
