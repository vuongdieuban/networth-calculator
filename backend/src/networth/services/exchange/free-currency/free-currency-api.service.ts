import { ExchangeService } from '../exchange.service';
import { lastValueFrom, map, take, tap } from 'rxjs';
import { CurrencyType } from 'src/shared/constants/currency-type.enum';
import { HttpService } from '@nestjs/axios';

export class FreeCurrencyApiRatesProvider extends ExchangeService {
  private ratesCache: Record<string, Record<string, number>>;
  constructor(private readonly httpService: HttpService) {
    super();
  }

  public async getRate(fromCurrency: CurrencyType, toCurrency: CurrencyType): Promise<number> {
    return this.ratesCache[fromCurrency][toCurrency] || 1;
  }

  public async loadRatesIntoCache(): Promise<void> {
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
    this.ratesCache = ratesRecord;
  }
}
