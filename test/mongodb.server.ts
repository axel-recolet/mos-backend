import { connection } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// This will create an new instance of "MongoMemoryServer" and automatically start it
let mongoServer: MongoMemoryServer;

export async function dbConnect(uri: string) {
  mongoServer = await MongoMemoryServer.create();
}

export async function dbDisconnect() {
  await connection.dropDatabase();
  await connection.close();
  await mongoServer.stop();
}
