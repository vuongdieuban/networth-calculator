import { Injectable } from '@nestjs/common';
import { CurrencyType } from 'src/shared/constants/currency-type.enum';

@Injectable()
export class ExchangeService {
  // {
  //   "CAD" : {
  //     "USD" : 1.2,
  //     "EURO": 1.3
  //   },
  //   "USD": {
  //     "CAD": 0.8,
  //     "EURO": 1.1
  //   }
  // }
  private cacheRates = new Map<string, Map<string, number>>();

  public getRate(fromCurrency: CurrencyType, toCurrency: CurrencyType) {
    return 1.2;
    // return this.cacheRates.get(currency);
  }
}
