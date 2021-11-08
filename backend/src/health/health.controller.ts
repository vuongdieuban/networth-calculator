import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { ExchangeService } from 'src/networth/services/exchange/exchange.service';
import { CurrencyType } from 'src/shared/constants/currency-type.enum';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly exchangeService: ExchangeService,
  ) {}

  @Get('test')
  async test() {
    await this.exchangeService.loadRatesIntoCache();
    return this.exchangeService.getRate(CurrencyType.CAD, CurrencyType.USD);
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com')]);
  }
}
