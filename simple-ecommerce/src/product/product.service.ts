import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Product } from '@prisma/client'; //引入Prisma自动生成的类型
import { CreateProductDto } from './dto/create-product.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  // 创建商品
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { price, stock, categoryId, userId } = createProductDto;

    // 确保价格、库存、分类ID和用户ID存在且是有效的数字
    if (price === null || price === undefined || isNaN(price) || price <= 0) {
      throw new HttpException('无效的价格', HttpStatus.BAD_REQUEST);
    }

    if (stock === null || stock === undefined || isNaN(stock) || stock < 0) {
      throw new HttpException('无效的库存', HttpStatus.BAD_REQUEST);
    }

    if (
      categoryId === null ||
      categoryId === undefined ||
      isNaN(categoryId) ||
      categoryId <= 0
    ) {
      throw new HttpException('无效的分类ID', HttpStatus.BAD_REQUEST);
    }

    if (
      userId === null ||
      userId === undefined ||
      isNaN(userId) ||
      userId <= 0
    ) {
      throw new HttpException('无效的用户ID', HttpStatus.BAD_REQUEST);
    }

    // 使用parse处理价格、库存和分类ID为正确的类型
    const parsedPrice = parseFloat(price.toString());
    const parsedStock = parseInt(stock.toString(), 10);
    const parsedCategoryId = parseInt(categoryId.toString(), 10);
    const parsedUserId = parseInt(userId.toString(), 10);

    // 使用正确的数据类型创建商品
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: parsedPrice,
        stock: parsedStock,
        category: { connect: { id: parsedCategoryId } },
        user: { connect: { id: parsedUserId } },
      },
    });
  }

  // 查询所有商品
  async findAll(userId: number) {
    return this.prisma.product.findMany({
      where: { userId: userId },
      include: { category: true },
    });
  }

  // 根据分类ID查询商品
  async findCategory(categoryId: number) {
    return this.prisma.product.findMany({
      where: { categoryId: categoryId },
      include: { category: true },
    });
  }

  // 根据id查询商品
  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id: id },
      include: { category: true },
    });
  }

  // 根据id更新商品
  async update(id: number, updateProductDto: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id: id },
      data: updateProductDto,
    });
  }

  // 根据id删除商品
  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id: id },
    });
  }
}
