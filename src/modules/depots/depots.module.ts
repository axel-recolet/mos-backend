import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'users/users.module';
import { UsersService } from '../users/users.service';
import { DepotsPermission } from './depots.permission';
import { DepotsService } from './depots.service';
import { DepotEntity, depotSchema, DepotsRepository } from './repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DepotEntity.name, schema: depotSchema },
    ]),
    UsersModule,
  ],
  providers: [DepotsRepository, DepotsPermission, DepotsService, UsersService],
  exports: [DepotsService, DepotsRepository, DepotsPermission],
})
export class DepotsModule {}
