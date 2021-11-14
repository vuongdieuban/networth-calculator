import { CurrencyType } from 'src/shared/constants/currency-type.enum';

export class SelectedCurrencyServiceMock {
  getAllSupportedCurrencies = jest.fn().mockReturnValue(Object.values(CurrencyType));
  getUserSelectedCurrency = jest.fn().mockReturnValue(CurrencyType.CAD);
  createSelectedCurrencyProfile = jest.fn();
  updateSelectedCurrencyProfile = jest.fn();
}
