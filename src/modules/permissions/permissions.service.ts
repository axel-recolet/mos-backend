import { Injectable } from '@nestjs/common';
import { IJwtUser } from '../auth';
import { CreateDepotDto } from '../depots';
import { UsersService } from '../users';

@Injectable()
export class PermissionsService {
  constructor(protected readonly _usersService: UsersService) {}

  async createDepot(
    jwtUser: IJwtUser,
    depot: CreateDepotDto,
  ): Promise<boolean> {
    const user = await this._usersService.findById(jwtUser.id);
    if (!user?.creditCard) throw new Error("User doesn't have credit card.");
    return true;
  }
}
