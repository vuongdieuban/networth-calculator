import { CurrencyType } from '../constants/currency-type.enum';

export class UserSelectedCurrencyResponseDto {
  userId: string;
  selectedCurrency: CurrencyType;
  supportedCurrencies: CurrencyType[];
}
