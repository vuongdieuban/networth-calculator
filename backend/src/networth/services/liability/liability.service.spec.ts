import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LiabilityInput } from 'src/networth/dtos/calculate-networth-request.dto';
import { LiabilityEntity } from 'src/networth/entities/liability.entity';
import { MockType, repositoryMockFactory } from 'src/shared/utils/test-utils';
import { Repository } from 'typeorm';
import { LiabilityService } from './liability.service';

describe('LiabilityService', () => {
  let service: LiabilityService;
  let liabilityRepo: MockType<Repository<LiabilityEntity>>;
  const userIdMock = 'abc';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LiabilityService,
        { provide: getRepositoryToken(LiabilityEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<LiabilityService>(LiabilityService);
    liabilityRepo = module.get(getRepositoryToken(LiabilityEntity));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('liability update and rate calculation', () => {
    it('should return undefined if cannot find liability profile by userId', async () => {
      jest.spyOn(liabilityRepo, 'findOne').mockImplementation(async () => undefined);
      const result = await service.updateLiabilityWithNewRateAndInput(
        userIdMock,
        2,
        {} as LiabilityInput,
      );
      expect(result).toBeUndefined();
    });

    it('should perform multiplication of the assetInput with the rate and save the updated value', async () => {
      const liability = { creditCard1: 10 } as LiabilityEntity;
      const assetInput = { creditCard1: 15 } as LiabilityInput;
      const rate = 2;

      jest.spyOn(liabilityRepo, 'findOne').mockImplementation(async () => liability);
      const saveSpy = jest.spyOn(liabilityRepo, 'save');

      await service.updateLiabilityWithNewRateAndInput(userIdMock, rate, assetInput);
      const savedEntity = saveSpy.mock.calls[0][0] as LiabilityEntity;
      expect(savedEntity.creditCard1).toEqual(assetInput.creditCard1 * rate);
    });
  });
});
