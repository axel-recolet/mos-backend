import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'utils/user.decorator';
import { GqlAuthGuard } from 'auth/gql-jwt-auth.guard';
import { Depot } from './depot.model';
import { DepotsService } from './depots.service';
import { CreateDepotDto } from './dto';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { IUser } from '../users';
import { IDepot } from './depot.interface';
import { Email } from 'src/utils/email.type';
import { isEmail } from 'class-validator';
import { ValidationError } from 'apollo-server-express';

@Resolver(() => Depot)
export class DepotsResolver {
  constructor(private readonly _depotsService: DepotsService) {}

  // Create
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

  // Read
  @Query((returns) => Depot, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async depot(
    @Args('id') id: string,
    @User() user: IUser,
  ): Promise<IDepot | undefined> {
    try {
      const result = await this._depotsService.findById(id, user);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Update
  @Mutation((returns) => Depot)
  @UseGuards(GqlAuthGuard)
  async changeDepotName(
    @Args('id') id: string,
    @Args('name') name: string,
    @User() user: IUser,
  ) {
    try {
      await this._depotsService.changeName(id, name, user);
      const result = await this._depotsService.findById(id, user);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => Depot)
  @UseGuards(GqlAuthGuard)
  async addAdmins(
    @Args('id') id: string,
    @Args('emails') emails: Email[],
    @User() user: IUser,
  ): Promise<IDepot> {
    try {
      for (const email of emails) {
        if (!isEmail(email)) {
          throw new ValidationError(`${email} has to be an Email`);
        }
      }

      return await this._depotsService.addAdmins(id, emails, user);
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => Depot)
  @UseGuards(GqlAuthGuard)
  async removeAdmins(
    @Args('id') id: string,
    @Args('emails') emails: Email[],
    @User() user: IUser,
  ): Promise<IDepot> {
    try {
      for (const email of emails) {
        if (!isEmail(email)) {
          throw new ValidationError(`${email} has to be an Email`);
        }
      }

      return await this._depotsService.removeAdmins(id, emails, user);
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => Depot)
  @UseGuards(GqlAuthGuard)
  async addUsers(
    @Args('id') id: string,
    @Args('emails') emails: Email[],
    @User() user: IUser,
  ) {
    try {
      for (const email of emails) {
        if (!isEmail(email)) {
          throw new ValidationError(`${email} has to be an Email`);
        }
      }

      return await this._depotsService.addUsers(id, emails, user);
    } catch (error) {
      throw error;
    }
  }

  @Mutation((returns) => Depot)
  @UseGuards(GqlAuthGuard)
  async removeUsers(
    @Args('id') id: string,
    @Args('emails') emails: Email[],
    @User() user: IUser,
  ) {
    try {
      for (const email of emails) {
        if (!isEmail(email)) {
          throw new ValidationError(`${email} has to be an Email`);
        }
      }

      return await this._depotsService.removeUsers(id, emails, user);
    } catch (error) {
      throw error;
    }
  }
}
