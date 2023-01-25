import { ObjectType } from '@nestjs/graphql';
import { IUser } from '../users/user.interface';
import { IDepot } from './depot.interface';

@ObjectType({ implements: () => [IDepot] })
export class Depot implements IDepot {
  id: string;
  name: string;
  admins: IUser[];
  users: IUser[];
}
