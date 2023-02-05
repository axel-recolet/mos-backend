import { Injectable } from '@nestjs/common';
import { IJwtUser } from 'auth';
import { IUser } from 'users';
import { IDepot } from './depot.interface';

@Injectable()
export class DepotsPermission {
  // Create
  async createDepot(user: IUser): Promise<boolean> {
    if (!user?.creditCard) throw new Error("User doesn't have credit card.");
    return true;
  }

  // Read
  async getDepot(jwtUser: IJwtUser, depotId: string): Promise<boolean> {
    for (const userDepot of jwtUser.depots) {
      if (userDepot.id === depotId) {
        return true;
      }
    }
    return false;
  }

  // Update
  async updateDepotAdmins(jwtUser: IJwtUser, depot: IDepot): Promise<boolean> {
    for (const admin of depot.admins) {
      if (admin.id === jwtUser.id) return true;
    }
    return false;
  }

  async updateDepotUsers(jwtUser: IJwtUser, depot: IDepot): Promise<boolean> {
    return this.updateDepotAdmins(jwtUser, depot);
  }
}
