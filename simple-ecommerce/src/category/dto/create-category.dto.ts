import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @ApiProperty()
  @IsOptional()
  parentId?: number;

  @IsInt()
  @ApiProperty()
  @IsNotEmpty()
  userId: number;
}
