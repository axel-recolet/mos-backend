import { Field, ID, InterfaceType } from '@nestjs/graphql';
import { User } from 'users/user.model';
import { IUser } from 'users/user.interface';

@InterfaceType({ isAbstract: true })
export abstract class IDepot {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => [User])
  admins: IUser[];

  @Field(() => [User])
  users: IUser[];
}
