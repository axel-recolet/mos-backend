import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService, EmailAlreadyUsed } from './auth.service';
import { SignupDto, LoginResponse, LoginDto } from './dto';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly _authService: AuthService) {}

  @Mutation((returns) => Boolean, { nullable: true })
  async register(@Args() createUserDto: SignupDto) {
    try {
      const result = await this._authService.register(createUserDto);
      return result;
    } catch (e) {
      if (e instanceof EmailAlreadyUsed) {
        throw new BadRequestException(e.message);
      }
    }
  }

  @Mutation((returns) => LoginResponse)
  async login(@Args() login: LoginDto) {
    try {
      const user = await (async () => {
        const result = await this._authService.validateUser(
          login.username,
          login.password,
        );
        if (!result) throw new UnauthorizedException();
        return {
          ...result,
          _id: result?._id.toString(),
        };
      })();

      return this._authService.login(user);
    } catch (error) {}
  }
}
