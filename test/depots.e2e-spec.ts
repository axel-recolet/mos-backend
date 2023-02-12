import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Document, Model, Types } from 'mongoose';
import { DepotDocument, DepotEntity, IDepot } from 'depots';
import { AppModule } from 'src/modules/app/app.module';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { fakeUser, UserDocument, UserEntity } from 'users';
import { JwtService } from '@nestjs/jwt';

// env
process.env.PORT = '3000';
process.env.JWT_SECRET = 'qdfljkn';

describe('Depots (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let jwtService: JwtService;
  let depotModel: Model<DepotDocument>;
  let userModel: Model<UserDocument>;

  const user = fakeUser();

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();

    process.env.MONGODB_URI = mongoUri;

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = app.get(JwtService);
    userModel = app.get<Model<UserDocument>>(getModelToken(UserEntity.name));
    depotModel = app.get<Model<DepotDocument>>(getModelToken(DepotEntity.name));
  });

  afterEach(async () => {
    await Promise.all([app.close(), mongod.stop({ force: true })]);
  });

  describe('create', () => {
    let user: Document<unknown, any, UserEntity> & UserEntity;
    let jwt: string;
    let depot: Omit<IDepot, 'id' | 'dueDate'>;

    beforeEach(async () => {
      user = await userModel.create(fakeUser({ id: undefined }));
      jwt = jwtService.sign({ id: user.id });
      depot = {
        name: faker.company.name(),
        creator: user.id,
        admins: [faker.internet.email()],
        users: [faker.internet.email()],
      };
    });

    it('should return depot', async () => {
      const {
        body: {
          data: { createDepot: body },
        },
      } = await request(app.getHttpServer())
        .post('/graphql')
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `mutation {
            createDepot(
              name: "${depot.name}",
              admins: [ ${depot.admins.map((admin) => `"${admin}", `)}],
              users: [ ${depot.users.map((user) => `"${user}", `)}]
            ) {
              id,
              name,
              creator,
              admins,
              users,
              dueDate
            }
          }`,
        });

      expect(body).toMatchObject(depot);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('dueDate');
    });

    it('should throw when a admin or user is not an Email', async () => {
      depot.admins.push(faker.name.firstName());

      const {
        body: { errors },
      } = await request(app.getHttpServer())
        .post('/graphql')
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `mutation {
            createDepot(
              name: "${depot.name}",
              admins: [ ${depot.admins.map((admin) => `"${admin}", `)}],
              users: [ ${depot.users.map((user) => `"${user}", `)}]
            ) {
              id,
            }
          }`,
        });

      expect(errors[0].extensions.response.statusCode).toBe(400);
    });
  });
});
