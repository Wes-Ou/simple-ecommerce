import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Prisma, Category } from '@prisma/client'; //引入Prisma自动生成的类型

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  //创建分类
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        parentId: createCategoryDto.parentId,
      },
    });
  }

  //查询所有分类
  async findAll() {
    return this.prisma.category.findMany({
      include: { products: true },
    });
  }

  //根据id查询分类
  async findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id: Number(id) },
      include: { products: true, children: true },
    });
  }

  //根据id更新分类
  async update(id: number, updateCategoryDto: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({
      where: { id: Number(id) },
      data: updateCategoryDto,
    });
  }

  //根据id删除分类
  async remove(id: number) {
    return this.prisma.category.delete({
      where: { id: Number(id) },
    });
  }
}
