import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { HealthController } from './health/health.controller';
import { HttpModule } from '@nestjs/axios';
import { NetworthController } from './networth/networth.controller';
import { ExchangeController } from './exchange/exchange.controller';
import { HashingService } from './shared/services/hashing.service';
import { UserEntity } from './user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { RefreshTokenEntity } from './auth/entities/refresh-token.entity';
import { AuthService } from './auth/services/auth.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { AuthController } from './auth/auth.controller';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { TokenService } from './auth/services/token.service';
import { NetworthService } from './networth/services/networth.service';
import { UserService } from './user/services/user.service';
import { AssetEntity } from './networth/entities/asset.entity';
import { LiabilityEntity } from './networth/entities/liability.entity';
import { UserSelectedCurrencyEntity } from './networth/entities/user-selected-currency.entity';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([
      UserEntity,
      RefreshTokenEntity,
      AssetEntity,
      LiabilityEntity,
      UserSelectedCurrencyEntity,
    ]),
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
    NetworthService,
  ],
})
export class AppModule {}
