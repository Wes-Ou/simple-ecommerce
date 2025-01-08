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

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(@Query('userId') userId: number): Promise<Category[]> {
    const userIdNumber = Number(userId);
    return this.categoryService.findAll(userIdNumber);
  }

  @Get('all')
  async findAllByUserId(@Query('userId') userId: number): Promise<Category[]> {
    const userIdNumber = Number(userId);
    return this.categoryService.findAllByUserId(userIdNumber);
  }

  @Get(':id/children')
  async findChildren(@Param('id') id: string): Promise<Category[]> {
    return this.categoryService.findChildren(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.categoryService.remove(+id);
  }
}
