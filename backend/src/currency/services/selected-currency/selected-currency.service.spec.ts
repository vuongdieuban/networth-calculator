import { Test, TestingModule } from '@nestjs/testing';
import { SelectedCurrencyService } from './selected-currency.service';

describe('SelectedCurrencyService', () => {
  let service: SelectedCurrencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SelectedCurrencyService],
    }).compile();

    service = module.get<SelectedCurrencyService>(SelectedCurrencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
