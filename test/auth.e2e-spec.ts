import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/modules/app/app.module';
import { INestApplication } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import { UserDocument, UserEntity, userFake } from 'src/modules/users';
import { getModelToken } from '@nestjs/mongoose';

// env
process.env.PORT = '3000';
process.env.JWT_SECRET = 'qdfljkn';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let userModel: Model<UserDocument>;

  const user = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    jwt: undefined,
    authorization: (jwt: string) => `Beaer ${jwt}`,
  };

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();

    process.env.MONGODB_URI = mongoUri;

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userModel = app.get<Model<UserDocument>>(getModelToken(UserEntity.name));
  });

  afterEach(async () => {
    await Promise.all([app.close(), mongod.stop({ force: true })]);
  });

  describe('signup', () => {
    it('should return email', async () => {
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
        });

      expect(body.data.signup).toHaveProperty('email');
    });

    it('should not able to return password', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            signup(
              email: "${user.email}",
              password: "${user.password}",
            ) {
              password
            }
          }`,
        });

      expect(body.errors[0]).toHaveProperty(
        'message',
        `Cannot query field "password" on type "User".`,
      );
    });

    it('should throw when Email is not free', async () => {
      const others: UserEntity[] = [userFake()];
      await userModel.insertMany(others);

      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
          signup(
            email: "${others[0].email}",
            password: "${faker.internet.password()}",
          ) {
            email
          }
        }`,
        });

      expect(body).toHaveProperty('errors[0].message');
      expect(body.data.signup).toBeNull();
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      const { email, password } = user;
      await userModel.create(
        userFake({ email, password, creditCard: undefined }),
      );
    });

    it('should return access_token', async () => {
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
        });

      expect(body.data.login).toHaveProperty('access_token');
    });

    it('should throw when the password is wrong', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
              login(
                username: "${user.email}",
                password: "${faker.internet.password()}"
              ) {
                access_token
              }
            }`,
        });

      expect(body.errors[0].extensions.response.statusCode).toEqual(401);
    });

    it("should throw when the email doen't exist", async () => {
      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
              login(
                username: "${faker.internet.email()}",
                password: "${user.password}"
              ) {
                access_token
              }
            }`,
        });

      expect(body.errors[0].extensions.response.statusCode).toEqual(401);
    });
  });
});
