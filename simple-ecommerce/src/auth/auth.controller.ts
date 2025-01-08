import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createAuthDto: RegisterDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
