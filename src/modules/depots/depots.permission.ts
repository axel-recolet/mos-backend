import { ForbiddenException, Injectable } from '@nestjs/common';
import { IUser } from 'users';
import { IDepot } from './depot.interface';

@Injectable()
export class DepotsPermission {
  private _isCreator(user: IUser, depot: IDepot): boolean {
    try {
      return depot.creator === user.email;
    } catch (error) {
      throw error;
    }
  }
  // Create
  async createDepot(user: IUser): Promise<boolean> {
    try {
      if (!user?.creditCard)
        throw new ForbiddenException("User doesn't have credit card.");
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Read
  async getDepot(user: IUser, depot: IDepot): Promise<boolean> {
    try {
      const { creator, admins, users } = depot;
      const collaborators = [creator, ...admins, ...users];
      if (!collaborators.includes(user.email)) {
        throw new ForbiddenException();
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Update
  async addAdmins(user: IUser, depot: IDepot): Promise<boolean> {
    try {
      if (this._isCreator(user, depot)) {
        return true;
      } else {
        throw new ForbiddenException();
      }
    } catch (error) {
      throw error;
    }
  }

  async removeAdmins(user: IUser, depot: IDepot): Promise<boolean> {
    try {
      if (this._isCreator(user, depot)) {
        return true;
      } else {
        throw new ForbiddenException();
      }
    } catch (error) {
      throw error;
    }
  }

  async addUsers(user: IUser, depot: IDepot): Promise<boolean> {
    try {
      if (this._isCreator(user, depot)) {
        return true;
      } else {
        throw new ForbiddenException();
      }
    } catch (error) {
      throw error;
    }
  }

  async removeUsers(user: IUser, depot: IDepot): Promise<boolean> {
    try {
      if (this._isCreator(user, depot)) {
        return true;
      } else {
        throw new ForbiddenException();
      }
    } catch (error) {
      throw error;
    }
  }

  async changeName(user: IUser, depot: IDepot): Promise<boolean> {
    try {
      return depot.creator === user.email;
    } catch (error) {
      throw error;
    }
  }
}
