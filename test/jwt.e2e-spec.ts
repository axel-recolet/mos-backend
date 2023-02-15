import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from 'src/modules/app/app.module';
import { IDepot } from 'depots';

// env
process.env.PORT = '3000';
process.env.JWT_SECRET = 'qdfljkn';

describe('JWT (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let jwtService: JwtService;

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
  });

  afterEach(async () => {
    await Promise.all([app.close(), mongod.stop({ force: true })]);
  });

  it('should throw an UnauthorizedException when there is no user id in the jwt', async () => {
    const jwt = jwtService.sign({});
    const {
      body: { errors },
    } = await request(app.getHttpServer())
      .post('/graphql')
      .set({ Authorization: `Bearer ${jwt}` })
      .send({
        query: `mutation {
          createDepot(
            name: "${faker.company.name()}",
            admins: [ "${faker.internet.email()}"],
            users: [ "${faker.internet.email()}"]
          ) {
            id,
          }
        }`,
      });

    expect(errors[0].extensions.response.statusCode).toBe(401);
  });

  it('should throw an UnauthorizedException when user id is not in the database', async () => {
    const jwt = jwtService.sign({ id: faker.database.mongodbObjectId() });
    const {
      body: { errors },
    } = await request(app.getHttpServer())
      .post('/graphql')
      .set({ Authorization: `Bearer ${jwt}` })
      .send({
        query: `mutation {
          createDepot(
            name: "${faker.company.name()}",
            admins: [ "${faker.internet.email()}"],
            users: [ "${faker.internet.email()}"]
          ) {
            id,
          }
        }`,
      });

    expect(errors[0].extensions.response.statusCode).toBe(401);
  });
});
