import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  password: string;
}
