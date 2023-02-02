import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import moment from 'moment';
import { Moment } from 'moment';
import { IUser } from 'users/user.interface';
import { User } from 'users/user.model';
import { IDepot } from './depot.interface';

@ObjectType()
export class Depot implements IDepot {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => User)
  creator: IUser;

  @Field(() => [User])
  admins: IUser[];

  @Field(() => [User])
  users: IUser[];

  @Field(() => String)
  @Transform(({ value }) => value, { toClassOnly: true })
  dueDate: Moment;

  isPremium(): boolean {
    return moment(this.dueDate).isAfter(moment());
  }
}
