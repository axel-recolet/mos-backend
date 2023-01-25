import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'users/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { DepotsService } from './depots.service';
import {
  DepotEntity as Depot,
  depotSchema,
  DepotsRepository,
} from './repository';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Depot.name, schema: depotSchema }]),
  ],
  providers: [UsersService, DepotsService, DepotsRepository],
  exports: [DepotsService, DepotsRepository],
})
export class DepotsModule {}
