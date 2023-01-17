import { DocType } from '../../../utils/docType.enum';

export interface IStorage {
  docType: DocType.Storage;
  name?: string;
  fillRate: number;
  comment?: string;
  containedIn?: IStorage;
}
