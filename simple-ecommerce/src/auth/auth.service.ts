import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtPayload } from './jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createEnrollDto: CreateAuthDto) {
    const { username, password, email } = createEnrollDto;
    const hashedPassword = await bcrypt.hash(password, 15);
    return this.userService.createUser({
      username,
      password: hashedPassword,
      email,
    });
  }

  async login(body: LoginDto) {
    const user = await this.userService.findByUsername(body.username);
    if (!user) {
      throw new Error('用户不存在');
    }
    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      throw new Error('密码错误');
    }
    const payload: JwtPayload = { username: user.username, userId: user.id };
    const token = this.jwtService.sign(payload);
    return { access_token: token, userId: user.id };
  }
}
