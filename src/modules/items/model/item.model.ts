import { Field, ObjectType } from '@nestjs/graphql';
import { IItem } from './item.interface';
import { Unit } from './unit.model';

@ObjectType()
export class Item implements IItem {
  @Field()
  id: string;

  @Field()
  docType: 'Item';

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
}
