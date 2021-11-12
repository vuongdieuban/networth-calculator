import { CurrencyType } from 'src/currency/constants/currency-type.enum';
import { ExchangeService } from '../exchange.service';
import * as MockData from './mock-rates-data.json';

// using mock data
export class LocalRatesProvider extends ExchangeService {
  private ratesCache: Record<string, Record<string, number>>;

  public async getRate(fromCurrency: CurrencyType, toCurrency: CurrencyType): Promise<number> {
    return this.ratesCache[fromCurrency][toCurrency] || 1;
  }

  public async loadRatesIntoCache(): Promise<void> {
    this.ratesCache = MockData;
    return;
  }
}
