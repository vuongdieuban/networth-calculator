import { Test, TestingModule } from '@nestjs/testing';
import { NetworthService } from './networth.service';

describe('NetworthService', () => {
  let service: NetworthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetworthService],
    }).compile();

    service = module.get<NetworthService>(NetworthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
