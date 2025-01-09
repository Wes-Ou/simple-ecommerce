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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '@prisma/client';
import { ApiOperation } from '@nestjs/swagger';
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: '为当前用户创建一个新分类' })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: '获取当前用户的顶级分类' })
  async findAll(@Query('userId') userId: number): Promise<Category[]> {
    const userIdNumber = Number(userId);
    return this.categoryService.findAll(userIdNumber);
  }

  @Get('all')
  @ApiOperation({ summary: '获取当前用户的所有分类' })
  async findAllByUserId(@Query('userId') userId: number): Promise<Category[]> {
    const userIdNumber = Number(userId);
    return this.categoryService.findAllByUserId(userIdNumber);
  }

  @Get(':id/children')
  @ApiOperation({ summary: '获取指定分类的子分类' })
  async findChildren(@Param('id') id: string): Promise<Category[]> {
    return this.categoryService.findChildren(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新指定分类的信息' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除指定分类' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.categoryService.remove(+id);
  }
}
