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
import { ApiOperation } from '@nestjs/swagger';
@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Post()
  @ApiOperation({ summary: '为当前用户创建一个新产品' })
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: '获取当前用户的所有产品' })
  async findAll(@Query('userId') userId: number): Promise<Product[]> {
    const userIdNumber = Number(userId);
    return this.productsService.findAll(userIdNumber);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: '获取指定分类的所有产品' })
  async findCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<Product[]> {
    const categoryIdNumber = Number(categoryId);
    return this.productsService.findCategory(categoryIdNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取指定产品的详细信息' })
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新指定产品的信息' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除指定产品' })
  async remove(@Param('id') id: string): Promise<Product> {
    return this.productsService.remove(+id);
  }
}
