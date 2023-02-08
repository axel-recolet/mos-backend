import { CreateDepotDto } from '../dto';
import { IDepot } from '../depot.interface';

export interface IDepotsRepository {
  create(depot: CreateDepotDto & { creator: string }): Promise<IDepot>;
}
