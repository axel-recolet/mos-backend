import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { IUser } from './user.interface';

export const userFake = (userDoc: Partial<IUser>): IUser => ({
  id: new mongoose.Types.ObjectId().toString(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  depots: [],
  creditCard: {
    id: 'ljnsdflkjn',
  },
  ...userDoc,
});
