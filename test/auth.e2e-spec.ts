import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/modules/app/app.module';
import { INestApplication } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import { fakeUser, UserDocument, UserEntity } from 'users';
import { getModelToken } from '@nestjs/mongoose';

// env
process.env.PORT = '3000';
process.env.JWT_SECRET = 'qdfljkn';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let userModel: Model<UserDocument>;

  const userDto = {
    email: faker.internet.email(),
    password: faker.internet.password(),
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
              email: "${userDto.email}",
              password: "${userDto.password}",
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
              email: "${userDto.email}",
              password: "${userDto.password}",
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
      const user = await userModel.create(userDto);

      const {
        body: { errors },
      } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
          signup(
            email: "${user.email}",
            password: "${faker.internet.password()}",
          ) {
            email
          }
        }`,
        });

      expect(errors[0].extensions.response.statusCode).toBe(403);
    });

    it('should throw when Email is not an Email', async () => {
      const {
        body: { errors },
      } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
          signup(
            email: "${faker.name.firstName()}",
            password: "${userDto.password}",
          ) {
            email
          }
        }`,
        });

      expect(errors[0].extensions.response.statusCode).toBe(400);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await userModel.create(fakeUser({ ...userDto, creditCard: undefined }));
    });

    it('should throw when the password is wrong', async () => {
      const {
        body: { errors },
      } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
              login(
                username: "${userDto.email}",
                password: "${faker.internet.password()}"
              ) {
                access_token
              }
            }`,
        });

      expect(errors[0].extensions.response.statusCode).toEqual(401);
    });

    it('should return access_token', async () => {
      const {
        body: {
          data: { login },
        },
      } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
              login(
                username: "${userDto.email}",
                password: "${userDto.password}"
              ) {
                access_token
              }
            }`,
        });
      console.log(login);
      expect(login).toHaveProperty('access_token');
    });

    it("should throw when the email doen't exist", async () => {
      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
              login(
                username: "${faker.internet.email()}",
                password: "${userDto.password}"
              ) {
                access_token
              }
            }`,
        });

      expect(body.errors[0].extensions.response.statusCode).toEqual(401);
    });
  });
});
