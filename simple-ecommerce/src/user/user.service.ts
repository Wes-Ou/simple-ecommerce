import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // 创建新用户
  async createUser(CreateUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: CreateUserDto });
  }

  // 根据用户名查找用户
  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  // 获取所有用户
  async findAll() {
    return this.prisma.user.findMany();
  }
}
