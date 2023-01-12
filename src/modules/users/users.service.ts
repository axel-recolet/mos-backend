import { Injectable } from '@nestjs/common';
import { LeanDocument, Types } from 'mongoose';
import { Email } from '../../utils/email.type';
import { Document } from '../../utils/document';
import { CreateUserDto } from '../auth/dto';
import { User } from './user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<
    LeanDocument<User> & {
      _id: Types.ObjectId;
    }
  > {
    return this.usersRepo.save(createUserDto);
  }

  async findOneByEmail(
    email: Email,
  ): Promise<Document<User> | undefined | null> {
    return await this.usersRepo.findByEmail(email);
  }
}
