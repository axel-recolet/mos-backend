import { Field, ObjectType } from '@nestjs/graphql';
import { ICreditCard } from './creditCard.interface';

@ObjectType()
export class CreditCard implements ICreditCard {
  @Field(() => String)
  id: string;
}
