import { ExchangeService } from '../exchange.service';
import { lastValueFrom, map, take } from 'rxjs';
import { CurrencyType } from 'src/shared/constants/currency-type.enum';
import { HttpService } from '@nestjs/axios';

export class FreeCurrencyApiRatesProvider extends ExchangeService {
  private ratesCache: Record<string, Record<string, number>>;
  private supportedCurrencies = Object.values(CurrencyType) as string[];

  constructor(private readonly httpService: HttpService) {
    super();
  }

  public async getRate(fromCurrency: CurrencyType, toCurrency: CurrencyType): Promise<number> {
    return this.ratesCache[fromCurrency][toCurrency] || 1;
  }

  public async loadRatesIntoCache(): Promise<void> {
    const ratesCache: Record<string, Record<string, number>> = {};

    const ratesPromises = this.fetchRatesFromProvider();
    const parsedRatesResponse = await Promise.all(ratesPromises);

    parsedRatesResponse.forEach(({ currency, parsedRates }) => {
      ratesCache[currency] = parsedRates;
    });

    this.ratesCache = ratesCache;
  }

  private fetchRatesFromProvider() {
    return this.supportedCurrencies.map((currency) => {
      const apiKey = process.env.API_KEY as string;
      const url = `https://freecurrencyapi.net/api/v2/latest?apikey=${apiKey}&base_currency=${currency}`;
      const response$ = this.httpService.get(url).pipe(
        take(1),
        map(({ data }) => data.data),
        map((rawRates: Record<string, number>) => {
          const parsedRates = this.extractRatesFromProviderResponse(currency, rawRates);
          return { currency, parsedRates };
        }),
      );
      return lastValueFrom(response$);
    });
  }

  private extractRatesFromProviderResponse(
    currency: string,
    rawRatesResponse: Record<string, number>,
  ): Record<string, number> {
    const parsedRates: Record<string, number> = {
      [currency]: 1,
    };

    for (const [key, value] of Object.entries(rawRatesResponse)) {
      if (this.supportedCurrencies.includes(key)) {
        parsedRates[key] = value;
      }
    }

    return parsedRates;
  }
}
