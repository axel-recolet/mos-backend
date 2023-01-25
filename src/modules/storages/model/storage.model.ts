import { Field, ObjectType, ID, Float } from '@nestjs/graphql';
import { Depot } from 'depots/depot.model';
import { Item } from 'items/model/item.model';
import { IStorage } from './storage.interface';

@ObjectType()
export class Storage implements IStorage {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  fillRate: number;

  @Field({ nullable: true })
  comment?: string;

  @Field(() => Storage, { nullable: true })
  containedIn?: Storage;

  @Field()
  depot: Depot;

  @Field(() => [Item])
  items: Item[];
}
