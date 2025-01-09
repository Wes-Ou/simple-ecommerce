import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(CreateUserDto: CreateUserDto) {
    const existingUser = await this.findByUsername(CreateUserDto.username);
    if (existingUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    const existingEmail = await this.findByEmail(CreateUserDto.email);
    if (existingEmail) {
      throw new HttpException('邮箱已存在', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.user.create({ data: CreateUserDto });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  async findAll() {
    return this.prisma.user.findMany();
  }
}
