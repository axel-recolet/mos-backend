import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'users/users.module';
import { PermissionsService } from '../permissions/permissions.service';
import { PermissionsModule } from '../permissions/premissions.module';
import { UsersService } from '../users/users.service';
import { DepotsService } from './depots.service';
import { DepotEntity, depotSchema, DepotsRepository } from './repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DepotEntity.name, schema: depotSchema },
    ]),
    UsersModule,
    PermissionsModule,
  ],
  providers: [
    DepotsRepository,
    DepotsService,
    UsersService,
    PermissionsService,
  ],
  exports: [DepotsService, DepotsRepository],
})
export class DepotsModule {}
