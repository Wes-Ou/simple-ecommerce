import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';
@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  //创建商品
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  //获取所有商品
  @Get()
  async findAll(@Query('userId') userId: number): Promise<Product[]> {
    const userIdNumber = Number(userId);
    return this.productsService.findAll(userIdNumber);
  }

  //根据分类查询商品
  @Get('category/:categoryId')
  async findCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<Product[]> {
    const categoryIdNumber = Number(categoryId);
    return this.productsService.findCategory(categoryIdNumber);
  }

  //获取单个商品
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(+id);
  }

  //更新商品
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(+id, updateProductDto);
  }

  //删除商品
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Product> {
    return this.productsService.remove(+id);
  }
}
