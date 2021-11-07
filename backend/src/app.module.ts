import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { HealthController } from './health/health.controller';
import { HttpModule } from '@nestjs/axios';
import { NetworthController } from './networth/networth.controller';
import { ExchangeController } from './exchange/exchange.controller';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { HashingService } from './shared/services/hashing.service';
import { UserEntity } from './user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity]),
    TerminusModule,
    HttpModule,
  ],
  controllers: [HealthController, NetworthController, ExchangeController, UserController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    UserService,
    HashingService,
  ],
})
export class AppModule {}
