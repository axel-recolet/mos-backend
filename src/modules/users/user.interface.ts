import { Email } from 'utils/email.type';
import { IDepot } from 'depots/depot.interface';

export abstract class IUser {
  id: string;

  email: Email;

  password: string;

  depots: IDepot[];
}
