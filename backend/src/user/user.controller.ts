import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { CreateUserResponseDto } from './dtos/create-user-response.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  public async createUser(@Body() payload: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const { username, password } = payload;
    const user = await this.userService.createUser(username, password);
    return { userId: user.id };
  }
}
