import { CurrencyType } from 'src/currency/constants/currency-type.enum';

export abstract class ExchangeService {
  abstract getRate(fromCurrency: CurrencyType, toCurrency: CurrencyType): Promise<number>;
  abstract loadRatesIntoCache(): Promise<void>;
}
