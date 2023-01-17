import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';
import { ItemsRepository } from './repository';
import { Item, ItemSchema } from './repository/item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
  ],
  providers: [ItemsResolver, ItemsRepository, ItemsService],
})
export class ItemsModule {}
