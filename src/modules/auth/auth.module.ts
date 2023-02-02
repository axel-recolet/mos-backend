import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/modules/users/users.module';
import { DepotsModule } from 'depots/depots.module';
import { DepotsService } from 'depots/depots.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UsersService } from '../users';
import { PermissionsModule } from '../permissions/premissions.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    DepotsModule,
    PermissionsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const jwt = configService.getOrThrow('jwt');
        return jwt;
      },
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    DepotsService,
    UsersService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
