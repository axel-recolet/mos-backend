import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'utils/user.decorator';
import { GqlAuthGuard } from 'auth/gql-jwt-auth.guard';
import { Depot } from './depot.model';
import { DepotsService } from './depots.service';
import { CreateDepotDto } from './dto';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { IUser } from '../users';

@Resolver(() => Depot)
export class DepotsResolver {
  constructor(private readonly _depotsService: DepotsService) {}

  @Mutation((returns) => Depot)
  @UseGuards(GqlAuthGuard)
  async createDepot(
    @Args(new ValidationPipe()) createDepotDto: CreateDepotDto,
    @User() user: IUser,
  ) {
    try {
      const result = await this._depotsService.create(createDepotDto, user);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
