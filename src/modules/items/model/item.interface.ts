import { IDepot } from 'src/modules/depots/depot.interface';
import { IStorage } from 'src/modules/storages/model';
import { Unit } from './unit.model';

export interface IItem {
  id: string;
  name: string;
  cpf?: string;
  brand: string;
  container: string;
  unit: Unit;
  containedIns: IStorage[];
  depot: IDepot;
}
