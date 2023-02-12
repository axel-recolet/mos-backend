import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { IUser, User } from 'users';
import { AuthService, EmailAlreadyUsed } from './auth.service';
import { SignupDto, LoginResponse, LoginDto } from './dto';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly _authService: AuthService) {}

  @Mutation((returns) => User, { nullable: true })
  async signup(
    @Args(new ValidationPipe()) createUserDto: SignupDto,
  ): Promise<Omit<IUser, 'password' | 'creditCard'>> {
    try {
      const result = await this._authService.signup(createUserDto);
      return result;
    } catch (e) {
      if (e instanceof EmailAlreadyUsed) {
        throw new ForbiddenException(e.message);
      }
      throw e;
    }
  }

  @Mutation((returns) => LoginResponse)
  async login(@Args(new ValidationPipe()) login: LoginDto) {
    try {
      const user = await (async () => {
        const result = await this._authService.validateUser(
          login.username,
          login.password,
        );
        if (!result) throw new UnauthorizedException();
        return result;
      })();

      return this._authService.login(user);
    } catch (error) {
      throw error;
    }
  }
}
