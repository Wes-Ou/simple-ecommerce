import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  async create(
    @Body()
    createUserDto: {
      username: string;
      password: string;
      email: string;
    },
  ) {
    return this.userService.createUser(createUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: '获取用户信息' })
  async getProfile(@Request() req) {
    return this.userService.findByUsername(req.user.email);
  }
}
