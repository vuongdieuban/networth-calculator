import { Test, TestingModule } from '@nestjs/testing';
import { NetworthServiceMock } from '../services/networth/mock/networth-service.mock';
import { NetworthService } from '../services/networth/networth.service';
import { SelectedCurrencyServiceMock } from '../services/selected-currency/mock/selected-currency-service.mock';
import { SelectedCurrencyService } from '../services/selected-currency/selected-currency.service';
import { ViewAdapterService } from '../services/view-adapter/view-adapter.service';
import { NetworthController } from './networth.controller';

describe('NetworthController', () => {
  let controller: NetworthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NetworthController],
      providers: [
        ViewAdapterService,
        {
          provide: NetworthService,
          useClass: NetworthServiceMock,
        },
        {
          provide: SelectedCurrencyService,
          useClass: SelectedCurrencyServiceMock,
        },
      ],
    }).compile();

    controller = module.get<NetworthController>(NetworthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
