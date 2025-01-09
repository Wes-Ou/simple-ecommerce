import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
export class LoginDto {
  @IsString()
  @ApiProperty()
  @MinLength(6)
  password: string;

  @IsString()
  @ApiProperty()
  username: string;
}
