import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ValidatedUser } from '../interfaces/validated-user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // by default passport-local strategy expects username and password field in request payload.
    // add configOpt to super() is the username field is different (ie: username => email)
    super();
  }

  // passport will call this method, if success will attach the user to the req.user and continue with request pipeline
  async validate(username: string, password: string): Promise<ValidatedUser> {
    const user = await this.authService.isUserExist(username);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const isValid = await this.authService.validateUser(user, password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return { userId: user.id };
  }
}
