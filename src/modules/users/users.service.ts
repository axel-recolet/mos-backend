import { Injectable } from '@nestjs/common';
import { Email } from '../../utils/email.type';
import { Document } from '../../utils/document.type';
import { SignupDto } from '../auth/dto';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { IUser } from './user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly _usersRepo: UsersRepository) {}

  async create(createUserDto: SignupDto): Promise<IUser> {
    try {
      return this._usersRepo.save(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: Email): Promise<IUser | undefined | null> {
    try {
      return await this._usersRepo.findByEmail(email);
    } catch (e) {
      throw e;
    }
  }

  async findById(id: string): Promise<IUser | undefined | null> {
    try {
      return this._usersRepo.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async exist(user: { id?: string; email?: Email }): Promise<boolean> {
    if (user.id) {
      return this._usersRepo.findById(user.id).then((user) => !user);
    } else if (user.email) {
      return this._usersRepo.findByEmail(user.email).then((user) => !user);
    } else {
      throw Error(`No prameters.`);
    }
  }
}
