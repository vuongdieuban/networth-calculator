import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload } from '../interfaces/access-token-payload';
import { ValidatedUser } from '../interfaces/validated-user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // Decode and verify the token is done by passport, if success then it calls the validate method, pass in the payload of decoded token
  // Passport will build a user object based on the return value of our validate() method, and attach it as a property on the req.user
  // payload is the decoded jwt payload
  public validate(payload: AccessTokenPayload): ValidatedUser {
    return { userId: payload.userId };
  }
}
