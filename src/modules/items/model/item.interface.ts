import { Unit } from './unit.model';

export interface IItem {
  docType: 'Item';
  name: string;
  cpf?: string;
  brand: string;
  container: string;
  unit: Unit;
}
