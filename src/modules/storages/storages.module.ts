import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from 'items';
import { UsersModule } from '../users';
import { StorageEntity, StorageSchema } from './repository/storage.entity';
import { StoragesRepository } from './repository/storages.mongodb.repository';
import { StoragesPermission } from './storages.permission';
import { StoragesResolver } from './storages.resolver';
import { StoragesService } from './storages.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StorageEntity.name, schema: StorageSchema },
    ]),
    UsersModule,
    ItemsModule,
  ],
  providers: [
    StoragesRepository,
    StoragesService,
    StoragesPermission,
    StoragesResolver,
  ],
  exports: [StoragesRepository, StoragesService, StoragesPermission],
})
export class StoragesModule {}
