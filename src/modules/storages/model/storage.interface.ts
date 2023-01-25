import { Depot } from 'depots/depot.model';

export abstract class IStorage {
  id: string;
  name: string;
  fillRate: number;
  comment?: string;
  containedIn?: IStorage;
  depot: Depot;
}
