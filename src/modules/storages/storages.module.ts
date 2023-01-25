import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from '../ability/ability.module';
import { AbilityService } from '../ability/ability.service';
import { ItemsModule } from '../items/items.module';
import { Storage, StorageSchema } from './repository/storage.schema';
import { StoragesRepository } from './repository/storages.repository';
import { StoragesResolver } from './storages.resolver';
import { StoragesService } from './storages.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Storage.name, schema: StorageSchema }]),
    AbilityModule,
    ItemsModule,
  ],
  providers: [
    StoragesRepository,
    StoragesService,
    StoragesResolver,
    AbilityService,
  ],
})
export class StoragesModule {}
