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

  //获取当前用户的顶级分类
  @Get()
  async findAll(@Query('userId') userId: number): Promise<Category[]> {
    const userIdNumber = Number(userId);
    return this.categoryService.findAll(userIdNumber);
  }
  //获取当前用户的所有分类
  @Get('all')
  async findAllByUserId(@Query('userId') userId: number): Promise<Category[]> {
    const userIdNumber = Number(userId);
    return this.categoryService.findAllByUserId(userIdNumber);
  }
  //查询当前分类的所有子分类
  @Get(':id/children')
  async findChildren(@Param('id') id: string): Promise<Category[]> {
    return this.categoryService.findChildren(+id);
  }

  //更新分类
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  // 删除分类及其商品和子分类
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    // 调用service中的remove方法，删除分类及其关联的商品和子分类
    return this.categoryService.remove(+id);
  }
}
