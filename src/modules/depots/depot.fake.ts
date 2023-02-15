import { faker } from '@faker-js/faker';
import * as moment from 'moment';
import { IDepot } from './depot.interface';

export const fakeDepot = (depot?: Partial<IDepot>): IDepot => ({
  id: faker.database.mongodbObjectId(),
  name: faker.company.name(),
  creator: faker.internet.email(),
  admins: [faker.internet.email()],
  users: [faker.internet.email()],
  dueDate: moment(faker.date.recent().toISOString(), moment.ISO_8601),
  ...depot,
});
