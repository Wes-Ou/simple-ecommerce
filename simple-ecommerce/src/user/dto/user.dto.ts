// 引入类验证装饰器
import { IsEmail, IsString, MinLength } from 'class-validator';
// 定义创建用户的Dto类
export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;
}
