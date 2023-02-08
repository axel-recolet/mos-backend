import { Moment } from 'moment';
import { IUser } from 'users/user.interface';

export interface IDepot {
  id: string;
  name: string;
  creator: IUser;
  admins: IUser[];
  users: IUser[];
  dueDate: Moment;
}
