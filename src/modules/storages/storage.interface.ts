import { IDepot } from '../depots';

export abstract class IStorage {
  id: string;
  name: string;
  fillRate: number;
  comment?: string;
  containedIn?: IStorage;
  depot: IDepot;
}
