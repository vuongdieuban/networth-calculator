import {
  Body,
  ConflictException,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CookieOptions, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterRequestDto, RegisterResponseDto } from '../dto/register';
import { ValidatedUser } from '../interfaces/validated-user';
import { UserService } from 'src/user/services/user.service';

@Controller('auth')
export class AuthController {
  private readonly REFRESH_TOKEN_COOKIE_NAME = 'demo-refresh-token';
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  public async register(@Body() payload: RegisterRequestDto): Promise<RegisterResponseDto> {
    const { username, password } = payload;
    const user = await this.userService.getUserByUserName(username);
    if (user) {
      throw new ConflictException('User already exist');
    }
    const newUser = await this.userService.createUser(username, password);
    return { userId: newUser.id };
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  public async login(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    // attached and validated by LocalAuthGuard
    const user = request.user as ValidatedUser;
    const { accessToken, refreshToken, accessTokenExpiredTs, refreshTokenExpiredTs } =
      await this.authService.login(user.userId);

    const cookieOptions = this.getCookieOptions();

    response.cookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieOptions);
    response.json({
      userId: user.userId,
      accessToken,
      accessTokenExpiredTs,
      refreshTokenExpiredTs,
    });
  }

  @Post('/logout')
  public async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const refreshToken = this.extractRefreshTokenFromCookie(request);

    await this.authService.logout(refreshToken);
    const cookieOptions = this.getCookieOptions();

    response.clearCookie(this.REFRESH_TOKEN_COOKIE_NAME, { ...cookieOptions, maxAge: 0 });
    response.json({ message: 'logout success' });
  }

  @Post('/renew-token')
  public async renewAccessAndRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const existedRefreshToken = this.extractRefreshTokenFromCookie(request);
    const credentials = await this.authService.renewAccessAndRefreshToken(existedRefreshToken);

    if (!credentials) {
      throw new UnauthorizedException('Invalid RefreshToken. Could not get AccessToken');
    }

    const { userId, refreshToken, accessToken, accessTokenExpiredTs, refreshTokenExpiredTs } =
      credentials;

    const cookieOptions = this.getCookieOptions();
    response.cookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieOptions);
    response.json({ userId, accessToken, accessTokenExpiredTs, refreshTokenExpiredTs });
  }

  private extractRefreshTokenFromCookie(request: Request): string {
    const refreshToken = request.cookies[this.REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token in cookie');
    }
    return refreshToken;
  }

  private getCookieOptions(): CookieOptions {
    return {
      sameSite: 'lax',
      secure: true,
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day,
    };
  }
}
