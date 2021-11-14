import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { HealthController } from './health/health.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { HashingService } from './shared/services/hashing/hashing.service';
import { UserEntity } from './user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { RefreshTokenEntity } from './auth/entities/refresh-token.entity';
import { AuthService } from './auth/services/auth.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { AuthController } from './auth/controllers/auth.controller';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { TokenService } from './auth/services/token.service';
import { UserService } from './user/services/user.service';
import { AssetEntity } from './networth/entities/asset.entity';
import { LiabilityEntity } from './networth/entities/liability.entity';
import { UserSelectedCurrencyEntity } from './networth/entities/user-selected-currency.entity';
import { ExchangeService } from './exchange/exchange.service';
import { LiabilityService } from './networth/services/liability/liability.service';
import { AssetService } from './networth/services/asset/asset.service';
import { NetworthService } from './networth/services/networth/networth.service';
import { exchangeProviderFactory } from './exchange/exchange-provider-factory';
import { TasksSchedulingService } from './shared/services/task-scheduling/task-scheduling.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ViewAdapterService } from './networth/services/view-adapter/view-adapter.service';
import { SelectedCurrencyService } from './networth/services/selected-currency/selected-currency.service';
import { NetworthController } from './networth/controllers/networth.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    PassportModule,
  ],
  controllers: [HealthController, NetworthController, AuthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: ExchangeService,
      useFactory: exchangeProviderFactory,
      inject: [HttpService],
    },
    UserService,
    HashingService,
    AuthService,
    JwtStrategy,
    LocalStrategy,
    TokenService,
    NetworthService,
    LiabilityService,
    AssetService,
    SelectedCurrencyService,
    TasksSchedulingService,
    ViewAdapterService,
  ],
})
export class AppModule {}
