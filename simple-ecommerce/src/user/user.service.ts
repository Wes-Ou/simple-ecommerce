import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(CreateUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: CreateUserDto });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }
}
