import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '@prisma/client';
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //创建分类
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  //获取所有分类
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  //根据id获取分类
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(+id);
  }

  //更新分类
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  //删除分类
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Category> {
    return this.categoryService.remove(+id);
  }
}
