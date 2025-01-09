import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsEmail } from 'class-validator';
export class RegisterDto {
  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  @MinLength(6)
  password: string;

  @IsEmail()
  @ApiProperty()
  email: string;
}
