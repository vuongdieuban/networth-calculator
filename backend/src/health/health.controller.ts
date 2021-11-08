import { HttpService } from '@nestjs/axios';
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { lastValueFrom, map, take, tap } from 'rxjs';
import { CurrencyType } from 'src/shared/constants/currency-type.enum';
import * as fs from 'fs';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly httpService: HttpService,
  ) {}

  @Get('test')
  public async test() {
    const baseCurrencies = Object.values(CurrencyType) as string[];
    const ratesRecord: Record<string, Record<string, number>> = {};
    baseCurrencies.forEach((currency) => {
      ratesRecord[currency] = {};
    });

    const promiseArr = baseCurrencies.map((currency) => {
      const url = `https://freecurrencyapi.net/api/v2/latest?apikey=a855f290-403d-11ec-8d71-55c3daa61ab5&base_currency=${currency}`;
      const response$ = this.httpService.get(url).pipe(
        take(1),
        map(({ data }) => data.data),
        tap((rates: Record<string, number>) => {
          const sanitizedRates = {
            [currency]: 1,
          };
          for (const [key, value] of Object.entries(rates)) {
            if (baseCurrencies.includes(key)) {
              sanitizedRates[key] = value;
            }
          }
          ratesRecord[currency] = sanitizedRates;
        }),
      );
      return lastValueFrom(response$);
    });

    await Promise.all(promiseArr);
    fs.writeFileSync('mock-rates-data.json', JSON.stringify(ratesRecord));
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com')]);
  }
}
