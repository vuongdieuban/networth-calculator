import { CurrencyType } from 'src/shared/constants/currency-type.enum';
import { ExchangeService } from '../exchange.service';
import * as MockData from './mock-rates-data.json';

// using mock data
export class LocalRatesProvider extends ExchangeService {
  private ratesCache: Record<string, Record<string, number>>;

  public async getRate(fromCurrency: CurrencyType, toCurrency: CurrencyType): Promise<number> {
    return this.ratesCache[fromCurrency][toCurrency] || 0;
  }

  public async loadRatesIntoCache(): Promise<void> {
    this.ratesCache = MockData;
    return;
  }
}
