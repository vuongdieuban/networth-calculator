import { Injectable } from '@nestjs/common';
import { CurrencyType } from 'src/shared/constants/currency-type.enum';

@Injectable()
export class ExchangeService {
  // https://freecurrencyapi.net/api/v2/latest?apikey=a855f290-403d-11ec-8d71-55c3daa61ab5&base_currency=CAD
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
