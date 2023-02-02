import { Module } from '@nestjs/common';
import { UsersModule, UsersService } from '../users';
import { PermissionsService } from './permissions.service';

@Module({
  imports: [UsersModule],
  providers: [PermissionsService, UsersService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
