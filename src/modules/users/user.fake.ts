import { User } from './user.schema';
import { faker } from '@faker-js/faker';
import { Document } from '../../utils/document.type';
import mongoose from 'mongoose';

export const userDocumentFake = (
  userDoc: Partial<Document<User>>,
): Document<User> => ({
  _id: new mongoose.Types.ObjectId(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  ...userDoc,
});
