import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from 'items';
import { PermissionsService } from '../permissions/permissions.service';
import { PermissionsModule } from '../permissions/premissions.module';
import { UsersModule } from '../users';
import { StorageEntity, StorageSchema } from './repository/storage.entity';
import { StoragesRepository } from './repository/storages.mongodb.repository';
import { StoragesResolver } from './storages.resolver';
import { StoragesService } from './storages.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StorageEntity.name, schema: StorageSchema },
    ]),
    PermissionsModule,
    UsersModule,
    ItemsModule,
  ],
  providers: [
    StoragesRepository,
    StoragesService,
    StoragesResolver,
    PermissionsService,
  ],
})
export class StoragesModule {}
