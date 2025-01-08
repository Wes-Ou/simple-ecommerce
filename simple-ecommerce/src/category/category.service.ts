import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Prisma, Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        parentId: createCategoryDto.parentId,
        userId: createCategoryDto.userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.category.findMany({
      where: {
        userId: Number(userId),
        parentId: null,
      },
    });
  }

  async findAllByUserId(userId: number) {
    return this.prisma.category.findMany({
      where: {
        userId: Number(userId),
      },
    });
  }

  async findChildren(id: number) {
    return this.prisma.category.findMany({
      where: {
        parentId: Number(id),
      },
    });
  }

  async update(id: number, updateCategoryDto: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({
      where: { id: Number(id) },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    const categoryToDelete = await this.prisma.category.findUnique({
      where: { id: Number(id) },
      include: {
        children: true,
        products: true,
      },
    });

    if (!categoryToDelete) {
      throw new Error('分类不存在');
    }

    return this.prisma.$transaction(async (prisma) => {
      const deleteCategoryAndProductsRecursively = async (
        categoryId: number,
      ) => {
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
          include: {
            children: true,
            products: true,
          },
        });

        if (category?.products.length > 0) {
          await prisma.product.deleteMany({
            where: {
              categoryId: categoryId,
            },
          });
        }

        for (const child of category?.children || []) {
          await deleteCategoryAndProductsRecursively(child.id);
        }

        await prisma.category.delete({
          where: { id: categoryId },
        });
      };

      await deleteCategoryAndProductsRecursively(id);

      return { message: '分类及其关联数据删除成功' };
    });
  }
}
