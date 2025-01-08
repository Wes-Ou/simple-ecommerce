import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { price, stock, categoryId, userId } = createProductDto;

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

    const parsedPrice = parseFloat(price.toString());
    const parsedStock = parseInt(stock.toString(), 10);
    const parsedCategoryId = parseInt(categoryId.toString(), 10);
    const parsedUserId = parseInt(userId.toString(), 10);

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

  async findAll(userId: number) {
    return this.prisma.product.findMany({
      where: { userId: userId },
      include: { category: true },
    });
  }

  async findCategory(categoryId: number) {
    return this.prisma.product.findMany({
      where: { categoryId: categoryId },
      include: { category: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id: id },
      include: { category: true },
    });
  }

  async update(id: number, updateProductDto: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id: id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id: id },
    });
  }
}
