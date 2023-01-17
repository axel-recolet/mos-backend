import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Storage, StorageSchema } from './repository/storage.schema';
import { StoragesRepository } from './repository/storages.repository';
import { StoragesResolver } from './storages.resolver';
import { StoragesService } from './storages.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Storage.name, schema: StorageSchema }]),
  ],
  providers: [StoragesRepository, StoragesService, StoragesResolver],
})
export class StoragesModule {}
