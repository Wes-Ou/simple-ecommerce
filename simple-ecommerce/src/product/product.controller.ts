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

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(@Query('userId') userId: number): Promise<Product[]> {
    const userIdNumber = Number(userId);
    return this.productsService.findAll(userIdNumber);
  }

  @Get('category/:categoryId')
  async findCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<Product[]> {
    const categoryIdNumber = Number(categoryId);
    return this.productsService.findCategory(categoryIdNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Product> {
    return this.productsService.remove(+id);
  }
}
