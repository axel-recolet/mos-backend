import {
  Controller,
  Post,
  Request,
  UseGuards,
  HttpCode,
  Put,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUser } from './dto/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }

  @HttpCode(200)
  @Put('/register')
  async register(@Body() newUser: CreateUser) {
    const result = this.authService.register(newUser);
    return result;
  }
}
