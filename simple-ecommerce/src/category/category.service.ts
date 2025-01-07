import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Prisma, Category } from '@prisma/client'; // 引入Prisma自动生成的类型

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // 创建分类
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        parentId: createCategoryDto.parentId,
        userId: createCategoryDto.userId,
      },
    });
  }

  // 查询当前用户的顶级分类
  async findAll(userId: number) {
    return this.prisma.category.findMany({
      where: {
        userId: Number(userId),
        parentId: null,
      },
    });
  }

  // 查询当前用户的所有分类
  async findAllByUserId(userId: number) {
    return this.prisma.category.findMany({
      where: {
        userId: Number(userId),
      },
    });
  }

  // 查询当前分类的所有子分类
  async findChildren(id: number) {
    return this.prisma.category.findMany({
      where: {
        parentId: Number(id),
      },
    });
  }

  // 根据id更新分类
  async update(id: number, updateCategoryDto: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({
      where: { id: Number(id) },
      data: updateCategoryDto,
    });
  }

  // 删除分类及其商品和子分类
  async remove(id: number) {
    const categoryToDelete = await this.prisma.category.findUnique({
      where: { id: Number(id) },
      include: {
        children: true, // 获取该分类的所有子分类
        products: true, // 获取该分类的所有商品
      },
    });

    // 如果找不到该分类，抛出异常
    if (!categoryToDelete) {
      throw new Error('分类不存在');
    }

    // 使用事务来删除相关数据，确保操作原子性
    return this.prisma.$transaction(async (prisma) => {
      // 递归删除子分类及其商品
      const deleteCategoryAndProductsRecursively = async (
        categoryId: number,
      ) => {
        // 获取当前分类的子分类和商品
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
          include: {
            children: true, // 获取当前分类的所有子分类
            products: true, // 获取当前分类的所有商品
          },
        });

        // 删除当前分类的商品
        if (category?.products.length > 0) {
          await prisma.product.deleteMany({
            where: {
              categoryId: categoryId,
            },
          });
        }

        // 递归删除所有子分类的商品和子分类
        for (const child of category?.children || []) {
          await deleteCategoryAndProductsRecursively(child.id);
        }

        // 删除当前分类
        await prisma.category.delete({
          where: { id: categoryId },
        });
      };

      // 调用递归删除函数，删除目标分类及其所有子分类和商品
      await deleteCategoryAndProductsRecursively(id);

      return { message: '分类及其关联数据删除成功' };
    });
  }
}
