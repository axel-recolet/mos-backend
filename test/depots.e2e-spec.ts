import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Document, Model } from 'mongoose';
import { DepotDocument, DepotEntity, IDepot } from 'depots';
import { AppModule } from 'src/modules/app/app.module';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { fakeUser, UserDocument, UserEntity } from 'users';
import { JwtService } from '@nestjs/jwt';
import { fakeDepot } from 'depots/depot.fake';

// env
process.env.PORT = '3000';
process.env.JWT_SECRET = 'qdfljkn';

describe('Depots (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let jwtService: JwtService;
  let depotModel: Model<DepotDocument>;
  let userModel: Model<UserDocument>;

  let userEntity: Document<unknown, any, UserEntity> & UserEntity;
  let jwt: string;
  let depot: Omit<IDepot, 'id' | 'dueDate'>;

  console.time('test');

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();

    console.timeLog('test', 'mongo');

    process.env.MONGODB_URI = mongoUri;

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    console.timeLog('test', 'app');

    app = moduleFixture.createNestApplication();
    await app.init();

    console.timeLog('test', 'app.init');

    jwtService = app.get(JwtService);
    userModel = app.get<Model<UserDocument>>(getModelToken(UserEntity.name));
    depotModel = app.get<Model<DepotDocument>>(getModelToken(DepotEntity.name));
  });

  afterEach(async () => {
    await Promise.all([userModel.deleteMany({}), depotModel.deleteMany({})]);
  });

  afterAll(async () => {
    await Promise.all([app.close(), mongod.stop({ force: true })]);
    console.timeLog('test', 'end');
  });

  describe('create', () => {
    beforeEach(async () => {
      userEntity = await userModel.create(fakeUser({ id: undefined }));
      jwt = jwtService.sign({ id: userEntity.id });
      depot = {
        name: faker.company.name(),
        creator: userEntity.id,
        admins: [faker.internet.email()],
        users: [faker.internet.email()],
      };
    });

    // Validation
    it('should throw when a admin or user is not an Email', async () => {
      depot.admins.push(faker.name.firstName());
      depot.users.push(faker.name.firstName());

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
      expect(errors[0].extensions.response.message[0]).toBe(
        'each value in admins must be an email',
      );
      expect(errors[0].extensions.response.message[1]).toBe(
        'each value in users must be an email',
      );
    });

    // Permission
    it('should throw an error when user is not allow to create a depot', async () => {
      await userEntity.updateOne({ $set: { creditCard: undefined } });

      const {
        body: { data, errors },
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

      expect(data).toBeNull();
      expect(errors[0].extensions.response.statusCode).toBe(403);
    });

    // All work
    it('should create depot', async () => {
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
  });

  describe('get', () => {
    beforeEach(async () => {
      userEntity = await userModel.create(fakeUser({ id: undefined }));
      jwt = jwtService.sign({ id: userEntity.id });
    });

    it('should throw an ForbiddenException when depot is not linked to the user', async () => {
      const depotEntity = (
        await depotModel.create(fakeDepot({ id: undefined }))
      ).toObject();

      const {
        body: { data, errors },
      } = await request(app.getHttpServer())
        .post('/graphql')
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `{
            depot( id: "${depotEntity.id}") {
              id,
            }
          }`,
        });

      expect(errors[0].extensions.response.statusCode).toBe(403);
    });

    it("should throw an ForbiddenException when user is linked to a which he doesn't have authorization", async () => {
      const depotEntity = (
        await depotModel.create(fakeDepot({ id: undefined }))
      ).toObject();

      await userEntity.updateOne({ $addToSet: { depots: depotEntity.id } });

      const {
        body: { data, errors },
      } = await request(app.getHttpServer())
        .post('/graphql')
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `{
            depot( id: "${depotEntity.id}") {
              name,
            }
          }`,
        });

      expect(errors[0].extensions.response.statusCode).toBe(403);
    });

    it("should return depot's name", async () => {
      const depotEntity = (
        await depotModel.create(
          fakeDepot({
            users: [faker.internet.email(), userEntity.email],
          }),
        )
      ).toObject();
      await userEntity.updateOne({ $addToSet: { depots: depotEntity.id } });

      const {
        body: { data },
      } = await request(app.getHttpServer())
        .post('/graphql')
        .set({ Authorization: `Bearer ${jwt}` })
        .send({
          query: `{
            depot( id: "${depotEntity.id}") {
              id,
              name,
            }
          }`,
        });

      expect(data.depot.name).toBe(depotEntity.name);
    });
  });
});
