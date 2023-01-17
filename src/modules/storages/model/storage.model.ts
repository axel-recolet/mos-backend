import { Field, ObjectType, Float } from '@nestjs/graphql';
import { Item } from 'src/modules/items/model/item.model';
import { DocType } from 'utils/docType.enum';
import { IStorage } from './storage.interface';

@ObjectType()
export class Storage implements IStorage {
  @Field()
  id: string;

  @Field()
  docType: DocType.Storage;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Float)
  fillRate: number;

  @Field({ nullable: true })
  comment?: string;

  @Field(() => Storage, { nullable: true })
  containedIn?: Storage;

  @Field(() => [Item])
  items: Item[];
}
