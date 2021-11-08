import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { ExchangeService } from 'src/networth/services/exchange/exchange.service';

@Injectable()
export class TasksSchedulingService {
  constructor(private readonly exchangeService: ExchangeService) {}

  // run once
  @Timeout(0)
  public async loadRatesOnStartup() {
    console.log('On Startup load rates');
    await this.exchangeService.loadRatesIntoCache();
  }

  // run at interval
  @Cron(CronExpression.EVERY_2_HOURS)
  public async loadRatesAtInterval() {
    console.log('Load Rates');
    await this.exchangeService.loadRatesIntoCache();
  }
}
