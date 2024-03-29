import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IStorage, Storage } from 'storages';
import { IItem } from './item.interface';
import { Unit } from './unit.model';
import { Depot } from 'src/modules/depots/depot.model';
import { IDepot } from 'src/modules/depots/depot.interface';

@ObjectType()
export class Item implements IItem {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  cpf?: string;

  @Field()
  brand: string;

  @Field()
  container: string;

  @Field(() => Unit)
  unit: Unit;

  @Field(() => [Storage])
  containedIns: IStorage[];

  @Field(() => Depot)
  depot: IDepot;
}
