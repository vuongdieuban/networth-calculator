import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from 'src/auth/controllers/auth.controller';
import { RefreshTokenEntity } from 'src/auth/entities/refresh-token.entity';
import { AuthService } from 'src/auth/services/auth.service';
import { TokenService } from 'src/auth/services/token.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { exchangeProviderFactory } from 'src/exchange/exchange-provider-factory';
import { ExchangeService } from 'src/exchange/exchange.service';
import { HealthController } from 'src/health/health.controller';
import { NetworthController } from 'src/networth/controllers/networth.controller';
import { AssetEntity } from 'src/networth/entities/asset.entity';
import { LiabilityEntity } from 'src/networth/entities/liability.entity';
import { UserSelectedCurrencyEntity } from 'src/networth/entities/user-selected-currency.entity';
import { AssetService } from 'src/networth/services/asset/asset.service';
import { LiabilityService } from 'src/networth/services/liability/liability.service';
import { NetworthService } from 'src/networth/services/networth/networth.service';
import { SelectedCurrencyService } from 'src/networth/services/selected-currency/selected-currency.service';
import { ViewAdapterService } from 'src/networth/services/view-adapter/view-adapter.service';
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor';
import { HashingService } from 'src/shared/services/hashing/hashing.service';
import { TasksSchedulingService } from 'src/shared/services/task-scheduling/task-scheduling.service';
import { repositoryMockFactory } from 'src/shared/utils/test-utils';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';

@Module({
  imports: [ScheduleModule.forRoot(), TerminusModule, HttpModule, PassportModule],
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
    { provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory },
    { provide: getRepositoryToken(RefreshTokenEntity), useFactory: repositoryMockFactory },
    { provide: getRepositoryToken(AssetEntity), useFactory: repositoryMockFactory },
    { provide: getRepositoryToken(UserSelectedCurrencyEntity), useFactory: repositoryMockFactory },
    { provide: getRepositoryToken(LiabilityEntity), useFactory: repositoryMockFactory },
  ],
})
export class TestModule {}
