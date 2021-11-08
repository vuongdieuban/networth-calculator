import { CurrencyType } from 'src/shared/constants/currency-type.enum';

export abstract class ExchangeService {
  abstract getRate(fromCurrency: CurrencyType, toCurrency: CurrencyType): Promise<number>;
  abstract loadRatesIntoCache(): Promise<void>;
}
