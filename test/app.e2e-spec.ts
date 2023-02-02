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

  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });

  it('signingUp /graphql', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        mutation: `{
        register(
          email: ${user.email},
          password: "${user.password}"
        ) {
          access_token
        }
      }`,
      })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
      });
  });
});
