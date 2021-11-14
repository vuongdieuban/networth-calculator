import { of } from 'rxjs';
import {
  networthDisplayViewModelMock,
  selectedCurrencyMock,
  supportedCurrenciesMock,
} from '../../../mock/networth-display-view-model.mock';
import { NetworthService } from '../networth.service';

export class NetworthServiceMock extends NetworthService {
  getUserSelectedCurrency = jest.fn().mockReturnValue(
    of({
      userId: 'abc123',
      selectedCurrency: selectedCurrencyMock,
      supportedCurrencies: supportedCurrenciesMock,
    })
  );
  getOrCreateNetworthProfile = jest.fn().mockReturnValue(of(networthDisplayViewModelMock));
  calculateNetworthProfile = jest.fn().mockReturnValue(of(networthDisplayViewModelMock));
}
