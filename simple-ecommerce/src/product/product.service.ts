import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Product } from '@prisma/client'; //引入Prisma自动生成的类型
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  //创建商品
  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
        category: { connect: { id: createProductDto.categoryId } },
        user: { connect: { id: createProductDto.userId } },
      },
    });
  }

  //查询所有商品
  async findAll() {
    return this.prisma.product.findMany({
      include: { category: true },
    });
  }

  //根据id查询商品
  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });
  }

  //根据id更新商品
  async update(id: number, updateProductDto: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id: Number(id) },
      data: updateProductDto,
    });
  }

  //根据id删除商品
  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id: Number(id) },
    });
  }
}
