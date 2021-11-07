import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { HealthController } from './health/health.controller';
import { HttpModule } from '@nestjs/axios';
import { NetworthController } from './networth/networth.controller';
import { ExchangeController } from './exchange/exchange.controller';
import { UserService } from './user/user.service';
import { HashingService } from './shared/services/hashing.service';
import { UserEntity } from './user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { RefreshTokenEntity } from './auth/entities/refresh-token.entity';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { TokenService } from './auth/token.service';
import { AuthController } from './auth/auth.controller';
import { LocalStrategy } from './auth/strategies/local.strategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity]),
    TerminusModule,
    HttpModule,
  ],
  controllers: [HealthController, NetworthController, ExchangeController, AuthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    UserService,
    HashingService,
    AuthService,
    JwtStrategy,
    LocalStrategy,
    TokenService,
  ],
})
export class AppModule {}
