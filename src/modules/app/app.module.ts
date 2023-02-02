import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import configuration from '../../configuration';
import { AuthModule } from 'auth/auth.module';
import { StoragesModule } from '../storages/storages.module';
import { ItemsModule } from '../items/items.module';
import { DepotsModule } from '../depots';
import { UsersModule } from '../users';
import { PermissionsModule } from '../permissions/premissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.getOrThrow('mongodb'),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    DepotsModule,
    PermissionsModule,
    AuthModule,
    UsersModule,
    StoragesModule,
    ItemsModule,
  ],
})
export class AppModule {
  static async bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get('port');
    await app.listen(port);
    console.log(`port :`, port);
  }
}
