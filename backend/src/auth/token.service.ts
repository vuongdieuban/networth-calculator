import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { AccessTokenPayload } from './interfaces/access-token-payload';
import { CredentialsTokens } from './interfaces/credentials-token';
import { RefreshTokenPayload } from './interfaces/refresh-token-payload';

interface GeneratedRefreshToken {
  refreshTokenId: string;
  signedRefreshToken: string;
}

@Injectable()
export class TokenService {
  private readonly JWT_SECRET: string;

  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepo: Repository<RefreshTokenEntity>,
  ) {
    if (!process.env.JWT_SECRET) {
      throw new Error('Fatal Error. Env JWT_SECRET not defined');
    }
    this.JWT_SECRET = process.env.JWT_SECRET;
  }

  public isTokenValid(token: string, ignoreExpiration = false): boolean {
    try {
      jwt.verify(token, this.JWT_SECRET, {
        ignoreExpiration,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  public isAccessTokenLinkToRefreshToken(
    signedAccessToken: string,
    refreshToken: RefreshTokenEntity,
  ) {
    const accessToken = jwt.decode(signedAccessToken) as AccessTokenPayload;
    return accessToken.refreshTokenId === refreshToken.id;
  }

  public getAccessTokenId(signedToken: string): string {
    const decodedToken = jwt.decode(signedToken) as AccessTokenPayload;
    return decodedToken.accessTokenId;
  }

  public getAccessTokenPayload(token: string): AccessTokenPayload {
    return jwt.decode(token) as AccessTokenPayload;
  }

  public getRefreshTokenId(signedToken: string): string {
    const decodedToken = jwt.decode(signedToken) as RefreshTokenPayload;
    return decodedToken.refreshTokenId;
  }

  public isRefreshTokenExpired(refreshToken: RefreshTokenEntity): boolean {
    return moment().isAfter(refreshToken.expiryDate);
  }

  public isRefreshTokenInvalidated(refreshToken: RefreshTokenEntity): boolean {
    return refreshToken.invalidated;
  }

  public async getRefreshTokenById(refreshTokenId: string): Promise<RefreshTokenEntity | null> {
    const refreshToken = await this.refreshTokenRepo.findOne(refreshTokenId, {
      relations: ['user'],
    });
    if (!refreshToken) {
      return null;
    }
    return refreshToken;
  }

  public async invalidateRefreshToken(refreshToken: RefreshTokenEntity): Promise<void> {
    refreshToken.invalidated = true;
    await this.refreshTokenRepo.save(refreshToken);
  }

  public async generateAccessTokenAndRefreshToken(userId: string): Promise<CredentialsTokens> {
    const { refreshTokenId, signedRefreshToken } = await this.generateRefreshToken(userId);
    const signedAccessToken = this.generateAccessToken(userId, refreshTokenId);
    return { accessToken: signedAccessToken, refreshToken: signedRefreshToken };
  }

  public async generateRefreshToken(userId: string): Promise<GeneratedRefreshToken> {
    let refreshToken = new RefreshTokenEntity();
    refreshToken.expiryDate = moment().add(7, 'd').toDate();

    refreshToken = await this.refreshTokenRepo.save(refreshToken);

    const payload: RefreshTokenPayload = {
      refreshTokenId: refreshToken.id,
      userId,
    };

    const signedRefreshToken = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: '1d',
      jwtid: refreshToken.id,
      subject: userId,
    });

    return { refreshTokenId: refreshToken.id, signedRefreshToken };
  }

  public generateAccessToken(userId: string, refreshTokenId: string): string {
    const accessTokenId = uuidv4();
    const payload: AccessTokenPayload = {
      accessTokenId,
      refreshTokenId,
      userId: userId,
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: '1h',
      jwtid: accessTokenId,
      // the subject should be the users id (primary key)
      subject: userId,
    });
  }
}
