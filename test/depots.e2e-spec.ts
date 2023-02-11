import { INestApplication } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import { DepotDocument, DepotEntity } from 'depots';
import { AppModule } from 'src/modules/app/app.module';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

// env
process.env.PORT = '3000';
process.env.JWT_SECRET = 'qdfljkn';

describe('Depots (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let depotModel: Model<DepotDocument>;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();

    process.env.MONGODB_URI = mongoUri;

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    depotModel = app.get<Model<DepotDocument>>(getModelToken(DepotEntity.name));
  });

  afterEach(async () => {
    await Promise.all([app.close(), mongod.stop({ force: true })]);
  });

  describe('create', () => {});
});
