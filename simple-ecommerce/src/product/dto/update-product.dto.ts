import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
export class UpdateProductDto {
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
  categoryId: number;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  userId: number;
}
