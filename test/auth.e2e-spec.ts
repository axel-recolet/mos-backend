import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/modules/app/app.module';
import { INestApplication } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.setTimeout(60000);

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;

  const user = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    jwt: undefined,
    authorization: (jwt: string) => `Beaer ${jwt}`,
  };

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = await mongod.getUri();

    process.env.MONGODB_URI = mongoUri;

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('auth', () => {
    test('signingUp /graphql', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            signup(
              email: "${user.email}",
              password: "${user.password}",
            ) {
              email
            }
          }`,
        })
        .expect(200);
      expect(body.data.signup).toHaveProperty('email');
    });

    test('login /graphql', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            login(
              username: "${user.email}",
              password: "${user.password}"
            ) {
              access_token
            }
          }`,
        })
        .expect(200);

      expect(body.data.login).toHaveProperty('access_token');
    });
  });

  afterAll(async () => {
    Promise.all([app.close(), mongod.stop()]);
  });
});
