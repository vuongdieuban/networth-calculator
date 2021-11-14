import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AssetInput } from 'src/networth/dtos/calculate-networth-request.dto';
import { AssetEntity } from 'src/networth/entities/asset.entity';
import { MockType, repositoryMockFactory } from 'src/shared/utils/test-utils';
import { Repository } from 'typeorm';
import { AssetService } from './asset.service';

describe('AssetService', () => {
  let service: AssetService;
  let assetRepo: MockType<Repository<AssetEntity>>;
  const userIdMock = 'abc';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetService,
        { provide: getRepositoryToken(AssetEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<AssetService>(AssetService);
    assetRepo = module.get(getRepositoryToken(AssetEntity));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('asset update and rate calculation', () => {
    it('should return undefined if cannot find asset profile by userId', async () => {
      jest.spyOn(assetRepo, 'findOne').mockImplementation(async () => undefined);
      const result = await service.updateAssetWithNewRateAndInput(userIdMock, 2, {} as AssetInput);
      expect(result).toBeUndefined();
    });

    it('should perform multiplication of the assetInput with the rate and save the updated value', async () => {
      const asset = { chequing: 10 } as AssetEntity;
      const assetInput = { chequing: 15 } as AssetInput;
      const rate = 2;

      jest.spyOn(assetRepo, 'findOne').mockImplementation(async () => asset);
      const saveSpy = jest.spyOn(assetRepo, 'save');

      await service.updateAssetWithNewRateAndInput(userIdMock, rate, assetInput);
      const savedEntity = saveSpy.mock.calls[0][0] as AssetEntity;
      expect(savedEntity.chequing).toEqual(assetInput.chequing * rate);
    });
  });
});
