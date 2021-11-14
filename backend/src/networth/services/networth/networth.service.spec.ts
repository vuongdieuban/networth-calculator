import each from 'jest-each';
import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeService } from 'src/exchange/exchange.service';
import { ExchangeServiceMock } from 'src/exchange/mock/exchange-service.mock';
import { AssetService } from '../asset/asset.service';
import { AssetServiceMock } from '../asset/mock/asset-service.mock';
import { LiabilityService } from '../liability/liability.service';
import { LiabilityServiceMock } from '../liability/mock/liability-service.mock';
import { SelectedCurrencyServiceMock } from '../selected-currency/mock/selected-currency-service.mock';
import { SelectedCurrencyService } from '../selected-currency/selected-currency.service';
import { NetworthService } from './networth.service';
import { AssetEntity } from 'src/networth/entities/asset.entity';
import { LiabilityEntity } from 'src/networth/entities/liability.entity';
import { UserSelectedCurrencyEntity } from 'src/networth/entities/user-selected-currency.entity';
import { CurrencyType } from 'src/shared/constants/currency-type.enum';
import {
  AssetInput,
  CalculateNetworthRequestDto,
  LiabilityInput,
} from 'src/networth/dtos/calculate-networth-request.dto';

describe('NetworthService', () => {
  let service: NetworthService;
  let exchangeService: ExchangeService;
  let assetService: AssetService;
  let liabilityService: LiabilityService;
  let currencyService: SelectedCurrencyService;
  const userIdMock = 'abc';

  const assetMock = {} as AssetEntity;
  const liabilityMock = {} as LiabilityEntity;
  const currencyMock = { currency: CurrencyType.CAD } as UserSelectedCurrencyEntity;

  let assetSpy: jest.SpyInstance;
  let liabilitySpy: jest.SpyInstance;
  let currencySpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NetworthService,
        {
          provide: LiabilityService,
          useClass: LiabilityServiceMock,
        },
        {
          provide: AssetService,
          useClass: AssetServiceMock,
        },
        {
          provide: SelectedCurrencyService,
          useClass: SelectedCurrencyServiceMock,
        },
        {
          provide: ExchangeService,
          useClass: ExchangeServiceMock,
        },
      ],
    }).compile();

    service = module.get<NetworthService>(NetworthService);
    exchangeService = module.get<ExchangeService>(ExchangeService);
    liabilityService = module.get<LiabilityService>(LiabilityService);
    assetService = module.get<AssetService>(AssetService);
    currencyService = module.get<SelectedCurrencyService>(SelectedCurrencyService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNetworthProfile', () => {
    beforeEach(() => {
      assetSpy = jest.spyOn(assetService, 'findAssetProfileByUser').mockResolvedValue(assetMock);

      liabilitySpy = jest
        .spyOn(liabilityService, 'findLiabilityProfileByUser')
        .mockResolvedValue(liabilityMock);

      currencySpy = jest
        .spyOn(currencyService, 'getUserSelectedCurrency')
        .mockResolvedValue(currencyMock);
    });

    it('should call assetService, liabilityService and currencyService to get user profile', async () => {
      await service.getNetworthProfile(userIdMock);
      expect(assetSpy).toHaveBeenCalledWith(userIdMock);
      expect(liabilitySpy).toHaveBeenCalledWith(userIdMock);
      expect(currencySpy).toHaveBeenCalledWith(userIdMock);
    });

    describe('undefined check', () => {
      // {} means exist
      each([
        [{}, {}, undefined],
        [{}, undefined, {}],
        [undefined, {}, {}],
        [{}, undefined, undefined],
      ]).it(
        'should return undefined if any of asset(%s), liability(%s) or selectedCurrency(%s) is undefiend',
        async (asset, liability, currency) => {
          jest.spyOn(assetService, 'findAssetProfileByUser').mockResolvedValue(asset);
          jest.spyOn(liabilityService, 'findLiabilityProfileByUser').mockResolvedValue(liability);
          jest.spyOn(currencyService, 'getUserSelectedCurrency').mockResolvedValue(currency);
          const profile = await service.getNetworthProfile(userIdMock);
          expect(profile).toBeUndefined();
        },
      );
    });

    it('should calculate networth profile data', async () => {
      const totalAsset = 10;
      const totalLiability = 5;
      const totalNetworth = totalAsset - totalLiability;

      jest.spyOn(assetService, 'calculateTotalAssetValue').mockReturnValue(totalAsset);
      jest.spyOn(liabilityService, 'calculateTotalLiabilityValue').mockReturnValue(totalLiability);

      const profile = await service.getNetworthProfile(userIdMock);
      expect(profile).toBeTruthy();
      expect(profile?.asset).toBe(assetMock);
      expect(profile?.liability).toBe(liabilityMock);
      expect(profile?.networthValues.totalAssets).toEqual(totalAsset);
      expect(profile?.networthValues.totalLiabilities).toEqual(totalLiability);
      expect(profile?.networthValues.totalNetworth).toEqual(totalNetworth);
      expect(profile?.selectedCurrency).toEqual(currencyMock.currency);
    });
  });

  describe('createInitialNetworthProfile', () => {
    it('should call assetService, liabilityService and currencyService to create user profile', async () => {
      const assetSpy = jest.spyOn(assetService, 'createInitialAssetProfile');
      const liabilitySpy = jest.spyOn(liabilityService, 'createInitialLiabilityProfile');
      const currencySpy = jest
        .spyOn(currencyService, 'createSelectedCurrencyProfile')
        .mockResolvedValue(currencyMock);

      await service.createInitialNetworthProfile(userIdMock);
      expect(assetSpy).toHaveBeenCalledWith(userIdMock);
      expect(liabilitySpy).toHaveBeenCalledWith(userIdMock);
      expect(currencySpy).toHaveBeenCalledWith(userIdMock);
    });
  });

  describe('calculateAndUpdateNetworthWithNewRate', () => {
    const rateMock = 1.5;
    const assetInputMock = {} as AssetInput;
    const liabilityInputMock = {} as LiabilityInput;
    const fromCurrency = CurrencyType.USD;
    const toCurrency = CurrencyType.CAD;

    const updatedInput: CalculateNetworthRequestDto = {
      fromCurrency,
      toCurrency,
      assets: assetInputMock,
      liabilities: liabilityInputMock,
    };

    it('should call exchangeService to getRate', async () => {
      const spy = jest.spyOn(exchangeService, 'getRate').mockResolvedValue(rateMock);
      await service.calculateAndUpdateNetworthWithNewRate(userIdMock, updatedInput);
      expect(spy).toHaveBeenCalledWith(fromCurrency, toCurrency);
    });

    it('should call assetService, liabilityService and currencyService to update profile with new input', async () => {
      jest.spyOn(exchangeService, 'getRate').mockResolvedValue(rateMock);

      const assetSpy = jest.spyOn(assetService, 'updateAssetWithNewRateAndInput');
      const liabilitySpy = jest.spyOn(liabilityService, 'updateLiabilityWithNewRateAndInput');
      const currencySpy = jest.spyOn(currencyService, 'updateSelectedCurrencyProfile');

      await service.calculateAndUpdateNetworthWithNewRate(userIdMock, updatedInput);

      expect(assetSpy).toHaveBeenCalledWith(userIdMock, rateMock, assetInputMock);
      expect(liabilitySpy).toHaveBeenCalledWith(userIdMock, rateMock, liabilityInputMock);
      expect(currencySpy).toHaveBeenCalledWith(userIdMock, toCurrency);
    });
  });
});
