import { Injectable } from '@nestjs/common';
import {
  AssetInput,
  CalculateNetworthRequestDto,
  LiabilityInput,
} from 'src/networth/dtos/calculate-networth-request.dto';
import { AssetEntity } from 'src/networth/entities/asset.entity';
import { LiabilityEntity } from 'src/networth/entities/liability.entity';
import { ExchangeService } from 'src/shared/services/exchange/exchange.service';
import { AssetService } from '../asset/asset.service';
import { LiabilityService } from '../liability/liability.service';

export interface NetworthValues {
  totalNetworth: number;
  totalAssets: number;
  totalLiabilities: number;
}

export interface NetworthProfile {
  networthValues: NetworthValues;
  liability: LiabilityEntity;
  asset: AssetEntity;
}

@Injectable()
export class NetworthService {
  constructor(
    private readonly liabilityService: LiabilityService,
    private readonly assetService: AssetService,
    private readonly exchangeService: ExchangeService,
  ) {}

  public async calculateAndUpdateNetworthWithNewRate(
    userId: string,
    updatedInput: CalculateNetworthRequestDto,
  ): Promise<NetworthProfile | undefined> {
    const { fromCurrency, toCurrency, assets, liabilities } = updatedInput;
    const rate = this.exchangeService.getRate(fromCurrency, toCurrency);
    const [updatedAsset, updatedLiability] = await this.updateAssetAndLiabilityWithNewRate(
      userId,
      rate,
      assets,
      liabilities,
    );

    if (!(updatedAsset && updatedLiability)) {
      return undefined;
    }
    return this.calculateAndGenerateNetworthProfile(updatedAsset, updatedLiability);
  }

  public async createInitialNetworthProfile(userId: string): Promise<NetworthProfile> {
    const assetPromise = this.assetService.createInitialAssetProfile(userId);
    const liabilityPromise = this.liabilityService.createInitialLiabilityProfile(userId);

    const [asset, liability] = await Promise.all([assetPromise, liabilityPromise]);
    return this.calculateAndGenerateNetworthProfile(asset, liability);
  }

  public async getNetworthProfile(userId: string): Promise<NetworthProfile | undefined> {
    const [asset, liability] = await this.getLiabilityAndAssetProfile(userId);
    if (!(asset && liability)) {
      return undefined;
    }
    return this.calculateAndGenerateNetworthProfile(asset, liability);
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
