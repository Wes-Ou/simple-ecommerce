import { IsString, IsInt, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsOptional()
  parentId?: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
