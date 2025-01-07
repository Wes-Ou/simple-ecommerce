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

  //用户注册
  async register(createEnrollDto: CreateAuthDto) {
    const { username, password, email } = createEnrollDto;
    //使用bcrypt库对密码进行加密，生成哈希值
    const hashedPassword = await bcrypt.hash(password, 15);
    //调用UserService的create方法，创建用户
    return this.userService.createUser({
      username,
      password: hashedPassword,
      email,
    });
  }
  //用户登录
  async login(body: LoginDto) {
    const user = await this.userService.findByUsername(body.username);
    if (!user) {
      throw new Error('用户不存在');
    }
    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      throw new Error('密码错误');
    }
    const payload: JwtPayload = { username: user.username, userId: user.id }; //jwt载荷
    const token = this.jwtService.sign(payload); //生成jwt令牌
    return { access_token: token, userId: user.id };
  }
}
