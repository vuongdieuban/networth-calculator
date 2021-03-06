import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/shared/services/hashing/hashing.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly hashingService: HashingService,
  ) {}

  public async getUserByUserName(username: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      username,
    });
  }

  public async createUser(username: string, password: string): Promise<UserEntity> {
    const hashedPassword = await this.hashingService.hashPassword(password);
    const user = this.userRepository.create({
      username,
      hashedPassword,
    });
    return this.userRepository.save(user);
  }
}
