import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
