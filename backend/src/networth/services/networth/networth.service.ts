import { Injectable } from '@nestjs/common';
import {
  AssetInput,
  CalculateNetworthRequestDto,
  LiabilityInput,
} from 'src/networth/dtos/calculate-networth-request.dto';
import { AssetEntity } from 'src/networth/entities/asset.entity';
import { LiabilityEntity } from 'src/networth/entities/liability.entity';
import { ExchangeService } from '../../../currency/services/exchange/exchange.service';
import { AssetService } from '../asset/asset.service';
import { LiabilityService } from '../liability/liability.service';
import { CurrencyType } from 'src/currency/constants/currency-type.enum';
import { SelectedCurrencyService } from 'src/currency/services/selected-currency/selected-currency.service';

export interface NetworthValues {
  totalNetworth: number;
  totalAssets: number;
  totalLiabilities: number;
}

export interface NetworthProfile {
  networthValues: NetworthValues;
  liability: LiabilityEntity;
  asset: AssetEntity;
  selectedCurrency: CurrencyType;
}

@Injectable()
export class NetworthService {
  constructor(
    private readonly liabilityService: LiabilityService,
    private readonly assetService: AssetService,
    private readonly exchangeService: ExchangeService,
    private readonly selectedCurrencyService: SelectedCurrencyService,
  ) {}

  public async calculateAndUpdateNetworthWithNewRate(
    userId: string,
    updatedInput: CalculateNetworthRequestDto,
  ): Promise<NetworthProfile | undefined> {
    const { fromCurrency, toCurrency, assets, liabilities } = updatedInput;
    const rate = await this.exchangeService.getRate(fromCurrency, toCurrency);
    const [updatedAsset, updatedLiability] = await this.updateAssetAndLiabilityWithNewRate(
      userId,
      rate,
      assets,
      liabilities,
    );

    const updatedCurrency = await this.selectedCurrencyService.updateSelectedCurrencyProfile(
      userId,
      toCurrency,
    );

    if (!(updatedAsset && updatedLiability && updatedCurrency)) {
      return undefined;
    }
    return this.calculateAndGenerateNetworthProfile(updatedAsset, updatedLiability, toCurrency);
  }

  public async getOrCreateNetworthProfile(userId: string): Promise<NetworthProfile> {
    let profile = await this.getNetworthProfile(userId);
    if (!profile) {
      profile = await this.createInitialNetworthProfile(userId);
    }
    return profile;
  }

  public async createInitialNetworthProfile(userId: string): Promise<NetworthProfile> {
    const assetPromise = this.assetService.createInitialAssetProfile(userId);
    const liabilityPromise = this.liabilityService.createInitialLiabilityProfile(userId);
    const selectedCurrencyPromise =
      this.selectedCurrencyService.getOrCreateUserSelectedCurrency(userId);

    const [asset, liability, selectedCurrency] = await Promise.all([
      assetPromise,
      liabilityPromise,
      selectedCurrencyPromise,
    ]);
    return this.calculateAndGenerateNetworthProfile(asset, liability, selectedCurrency.currency);
  }

  public async getNetworthProfile(userId: string): Promise<NetworthProfile | undefined> {
    const [asset, liability] = await this.getLiabilityAndAssetProfile(userId);
    const selectedCurrency = await this.selectedCurrencyService.getUserSelectedCurrency(userId);
    if (!(asset && liability && selectedCurrency)) {
      return undefined;
    }
    return this.calculateAndGenerateNetworthProfile(asset, liability, selectedCurrency.currency);
  }

  private async updateAssetAndLiabilityWithNewRate(
    userId: string,
    rate: number,
    assetInput: AssetInput,
    liabilityInput: LiabilityInput,
  ): Promise<[AssetEntity | undefined, LiabilityEntity | undefined]> {
    const updatedAssetPromise = this.assetService.updateAssetWithNewRateAndInput(
      userId,
      rate,
      assetInput,
    );
    const updatedLiabilityPromise = this.liabilityService.updateLiabilityWithNewRateAndInput(
      userId,
      rate,
      liabilityInput,
    );
    return Promise.all([updatedAssetPromise, updatedLiabilityPromise]);
  }

  private calculateAndGenerateNetworthProfile(
    asset: AssetEntity,
    liability: LiabilityEntity,
    selectedCurrency: CurrencyType,
  ): NetworthProfile {
    const totalAssets = this.assetService.calculateTotalAssetValue(asset);
    const totalLiabilities = this.liabilityService.calculateTotalLiabilityValue(liability);

    const totalNetworth = totalAssets - totalLiabilities;
    const networthValues = {
      totalNetworth,
      totalAssets,
      totalLiabilities,
    };

    return {
      selectedCurrency,
      networthValues,
      asset,
      liability,
    };
  }

  private async getLiabilityAndAssetProfile(
    userId: string,
  ): Promise<[AssetEntity | undefined, LiabilityEntity | undefined]> {
    const assetPromise = this.assetService.findAssetProfileByUser(userId);
    const liabilityPromise = this.liabilityService.findLiabilityProfileByUser(userId);
    return Promise.all([assetPromise, liabilityPromise]);
  }
}
