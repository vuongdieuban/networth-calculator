import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashingService } from 'src/shared/services/hashing/hashing.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { CredentialsTokens } from '../interfaces/credentials-token';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  public isUserExist(username: string): Promise<UserEntity | undefined> {
    return this.userService.getUserByUserName(username);
  }

  public async validateUser(user: UserEntity, rawPassword: string) {
    return this.hashingService.isPasswordValid(rawPassword, user.hashedPassword);
  }

  public async login(userId: string): Promise<CredentialsTokens> {
    return this.tokenService.generateAccessTokenAndRefreshToken(userId);
  }

  public async logout(signedRefreshToken: string): Promise<void> {
    const isRefreshTokenValid = this.tokenService.isTokenValid(signedRefreshToken, true);
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid Token');
    }

    const refreshTokenId = this.tokenService.getRefreshTokenId(signedRefreshToken);
    const refreshToken = await this.tokenService.getRefreshTokenById(refreshTokenId);

    if (refreshToken) {
      await this.tokenService.invalidateRefreshToken(refreshToken);
    }
  }

  public async renewAccessToken(
    signedRefreshToken: string,
  ): Promise<[string, CredentialsTokens] | undefined> {
    const isRefreshTokenValid = this.tokenService.isTokenValid(signedRefreshToken, true);
    if (!isRefreshTokenValid) {
      return undefined;
    }

    const refreshTokenId = this.tokenService.getRefreshTokenId(signedRefreshToken);
    const refreshToken = await this.tokenService.getRefreshTokenById(refreshTokenId);

    if (!refreshToken) {
      return undefined;
    }

    if (this.tokenService.isRefreshTokenInvalidated(refreshToken)) {
      return undefined;
    }

    if (this.tokenService.isRefreshTokenExpired(refreshToken)) {
      await this.tokenService.invalidateRefreshToken(refreshToken);
      return undefined;
    }

    const { userId } = refreshToken;
    const signedAccessToken = this.tokenService.generateAccessToken(userId, refreshToken.id);

    const updatedCredentials: CredentialsTokens = {
      accessToken: signedAccessToken,
      refreshToken: signedRefreshToken,
    };
    return [userId, updatedCredentials];
  }
}
