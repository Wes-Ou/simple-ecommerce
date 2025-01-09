import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  parentId: number;
}
