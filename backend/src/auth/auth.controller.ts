import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CookieOptions, Request, Response } from 'express';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { SignUpRequestDto, SignUpResponseDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  private readonly REFRESH_TOKEN_COOKIE_NAME = 'demo-refresh-token';
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/sign-up')
  public async signup(@Body() payload: SignUpRequestDto): Promise<SignUpResponseDto> {
    const { username, password } = payload;
    const user = await this.userService.getOrCreateUser(username, password);
    console.log('USEr', user);
    return { userId: user.id };
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  public async login(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    // attached and validated by LocalAuthGuard
    const user = request.user as UserEntity;
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const { accessToken, refreshToken } = await this.authService.login(user.id);

    const cookieOptions = this.getCookieOptions();

    response.cookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieOptions);
    response.json({ accessToken, userId: user.id });
  }

  @Post('/logout')
  public async logout(@Req() request: Request, @Res() response: Response): Promise<void> {
    const accessToken = this.extractAccessTokenFromAuthHeader(request);
    const refreshToken = this.extractRefreshTokenFromCookie(request);

    await this.authService.logout(accessToken, refreshToken);
    const cookieOptions = this.getCookieOptions();

    response.clearCookie(this.REFRESH_TOKEN_COOKIE_NAME, { ...cookieOptions, maxAge: 0 });
    response.send('logout success');
  }

  @Post('/renew-token')
  public async renewAccessToken(@Req() request: Request, @Res() response: Response): Promise<void> {
    const existedRefreshToken = this.extractRefreshTokenFromCookie(request);
    const [user, { refreshToken, accessToken }] = await this.authService.renewAccessToken(
      existedRefreshToken,
    );

    const cookieOptions = this.getCookieOptions();

    response.cookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieOptions);
    response.json({ accessToken, user });
  }

  private extractAccessTokenFromAuthHeader(request: Request): string {
    // Authorization: Bearer eyJhbGciOiJIUzI1NiIXVCJ9...TJVA95OrM7E20RMHrHDcEfxjoYZgeFONFh7HgQ
    const bearerToken =
      (request.headers['authorization'] as string) || (request.headers['Authorization'] as string);

    if (!bearerToken) {
      throw new UnauthorizedException('Missing Authorization Bearer token in request header');
    }
    return bearerToken.split(' ')[1];
  }

  private extractRefreshTokenFromCookie(request: Request): string {
    const refreshToken = request.cookies[this.REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token in cookie');
    }
    return refreshToken;
  }

  private getCookieOptions(): CookieOptions {
    const localEnv = process.env.NODE_ENV === 'development';
    return {
      sameSite: 'lax',
      secure: !localEnv,
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    };
  }
}
