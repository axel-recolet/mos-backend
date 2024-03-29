import { IJwtUser } from 'auth/jwt.strategy';
import { CreateStorageDto, UpdateStorageDto } from './dto';

export class StoragesPermission {
  // Create
  async createStorage(
    user: IJwtUser,
    createStorage: CreateStorageDto,
  ): Promise<boolean> {
    try {
      const userDepot = user.depots.find(
        (depot) => depot.id === createStorage.depot,
      );

      return !!userDepot;
    } catch (error) {
      throw error;
    }
  }

  async updateStorage(
    user: IJwtUser,
    updateStorage: UpdateStorageDto,
  ): Promise<boolean> {
    try {
      const userDepot = user.depots.find(
        (depot) => depot.id === updateStorage.depot,
      );

      return !!userDepot;
    } catch (error) {
      throw error;
    }
  }
}
