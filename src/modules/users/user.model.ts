import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Depot } from 'depots/depot.model';
import { Email } from 'src/utils/email.type';
import { IUser } from './user.interface';
import { CreditCard } from './creditCard.model';

@ObjectType()
export class User implements IUser {
  @Field(() => ID)
  id: string;

  @Field()
  email: Email;

  password: string;

  @Field(() => [Depot])
  depots: Depot[];

  @Field(() => CreditCard, { nullable: false })
  creditCard?: CreditCard;
}
