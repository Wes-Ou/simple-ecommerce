import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @IsString()
  @ApiProperty()
  @IsOptional()
  description: string;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  stock: number;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  categoryId: number;
}
