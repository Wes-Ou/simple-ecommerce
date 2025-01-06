import { IsString, MinLength, IsEmail } from 'class-validator';
export class CreateAuthDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;
}
