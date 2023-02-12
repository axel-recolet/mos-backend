import { Moment } from 'moment';
import { Email } from 'utils/email.type';

export interface IDepot {
  id: string;
  name: string;
  creator: string;
  admins: Email[];
  users: Email[];
  dueDate: Moment;
}
