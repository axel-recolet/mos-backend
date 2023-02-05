import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/modules/app/app.module';
import { INestApplication } from '@nestjs/common';
import { faker } from '@faker-js/faker';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const user = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    jwt: undefined,
    authorization: (jwt: string) => `Beaer ${jwt}`,
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });

  it('signingUp /graphql', async () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          signup(
            email: "${user.email}",
            password: "${user.email}",
          ) {
            email
          }
        }`,
      })
      .expect(200);
  });

  it('login /graphql', async () => {
    return request(app.getHttpServer())
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
  });
});
