import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
