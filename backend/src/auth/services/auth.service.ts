import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashingService } from 'src/shared/services/hashing/hashing.service';
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

  public async validateUser(username: string, rawPassword: string) {
    const user = await this.userService.getUserByUserName(username);
    if (!user) {
      return null;
    }

    const isPasswordValid = this.hashingService.isPasswordValid(rawPassword, user.hashedPassword);
    if (!isPasswordValid) {
      return null;
    }

    const { hashedPassword, ...result } = user;
    return result;
  }

  public async login(userId: string): Promise<CredentialsTokens> {
    return this.tokenService.generateAccessTokenAndRefreshToken(userId);
  }

  public async logout(signedAccessToken: string, signedRefreshToken: string): Promise<void> {
    const isAccessTokenValid = this.tokenService.isTokenValid(signedAccessToken, true);
    const isRefreshTokenValid = this.tokenService.isTokenValid(signedRefreshToken, true);
    if (!(isAccessTokenValid && isRefreshTokenValid)) {
      throw new UnauthorizedException('Invalid Token');
    }

    const refreshTokenId = this.tokenService.getRefreshTokenId(signedRefreshToken);
    const refreshToken = await this.tokenService.getRefreshTokenById(refreshTokenId);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    if (!this.tokenService.isAccessTokenLinkToRefreshToken(signedAccessToken, refreshToken)) {
      throw new UnauthorizedException('Access Token and Refresh Token do not match');
    }

    if (this.tokenService.isRefreshTokenInvalidated(refreshToken)) {
      throw new UnauthorizedException('Refresh Token Invalidated');
    }
    await this.tokenService.invalidateRefreshToken(refreshToken);
  }

  public async renewAccessToken(signedRefreshToken: string): Promise<[string, CredentialsTokens]> {
    const isRefreshTokenValid = this.tokenService.isTokenValid(signedRefreshToken, true);
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const refreshTokenId = this.tokenService.getRefreshTokenId(signedRefreshToken);
    const refreshToken = await this.tokenService.getRefreshTokenById(refreshTokenId);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh Token not found');
    }

    if (this.tokenService.isRefreshTokenInvalidated(refreshToken)) {
      throw new UnauthorizedException('Refresh Token invalidated');
    }

    if (this.tokenService.isRefreshTokenExpired(refreshToken)) {
      await this.tokenService.invalidateRefreshToken(refreshToken);
      throw new UnauthorizedException('Refresh Token Expired');
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
