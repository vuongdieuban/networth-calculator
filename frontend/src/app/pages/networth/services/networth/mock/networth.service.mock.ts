import { of } from 'rxjs';
import {
  networthDisplayViewModelMock,
  supportedCurrenciesMock,
} from '../../../mock/networth-display-view-model.mock';
import { NetworthService } from '../networth.service';

export class NetworthServiceMock extends NetworthService {
  getSupportedCurrencies = jest.fn().mockReturnValue(of(supportedCurrenciesMock));
  getOrCreateNetworthProfile = jest.fn().mockReturnValue(of(networthDisplayViewModelMock));
  calculateNetworthProfile = jest.fn().mockReturnValue(of(networthDisplayViewModelMock));
}
