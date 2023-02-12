import { Injectable } from '@nestjs/common';
import { IUser } from 'users';
import { IDepot } from './depot.interface';

@Injectable()
export class DepotsPermission {
  // Create
  async createDepot(user: IUser): Promise<boolean> {
    try {
      if (!user?.creditCard) throw new Error("User doesn't have credit card.");
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Read
  async getDepot(user: IUser, depotId: string): Promise<boolean> {
    try {
      for (const userDepot of user.depots) {
        if (userDepot.id === depotId) {
          return true;
        }
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  // Update
  async updateDepotAdmins(user: IUser, depot: IDepot): Promise<boolean> {
    try {
      for (const admin of depot.admins) {
        if (admin === user.email) return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  async updateDepotUsers(user: IUser, depot: IDepot): Promise<boolean> {
    try {
      return this.updateDepotAdmins(user, depot);
    } catch (error) {
      throw error;
    }
  }
}
