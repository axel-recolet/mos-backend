import {
  Controller,
  Post,
  Request,
  UseGuards,
  HttpCode,
  Put,
  Body,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { AuthService, EmailAlreadyUsed } from './auth.service';
import { CreateUserDto } from './dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Put('register')
  async register(@Body() newUser: CreateUserDto) {
    try {
      const result = await this.authService.register(newUser);
      return result;
    } catch (e) {
      if (e instanceof EmailAlreadyUsed) {
        throw new BadRequestException(e.message);
      }
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
