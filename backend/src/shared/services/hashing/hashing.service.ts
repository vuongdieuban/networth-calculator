import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashingService {
  private readonly saltRound = 10;

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRound);
    return bcrypt.hash(password, salt);
  }

  public async isPasswordValid(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
