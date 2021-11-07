import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { HealthController } from './health/health.controller';
import { HttpModule } from '@nestjs/axios';
import { NetworthController } from './networth/networth.controller';
import { ExchangeController } from './exchange/exchange.controller';
import { UserController } from './user/user.controller';

@Module({
  imports: [TypeOrmModule.forRoot(), TerminusModule, HttpModule],
  controllers: [
    HealthController,
    NetworthController,
    ExchangeController,
    UserController,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
