import { Test, TestingModule } from '@nestjs/testing';
import { ViewAdapterService } from './view-adapter.service';

describe('ViewAdapterService', () => {
  let service: ViewAdapterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewAdapterService],
    }).compile();

    service = module.get<ViewAdapterService>(ViewAdapterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
