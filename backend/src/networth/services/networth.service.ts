import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetEntity } from '../entities/asset.entity';
import { LiabilityEntity } from '../entities/liability.entity';

export interface NetworthValues {
  totalNetworth: number;
  totalAssets: number;
  totalLiabilities: number;
}

@Injectable()
export class NetworthService {
  constructor(
    @InjectRepository(LiabilityEntity)
    private readonly liabilityRepo: Repository<LiabilityEntity>,
    @InjectRepository(AssetEntity)
    private readonly assetRepo: Repository<AssetEntity>,
  ) {}

  public calculateNetworthValues(asset: AssetEntity, liability: LiabilityEntity): NetworthValues {
    const totalAssets = this.calculateTotalAssetValue(asset);
    const totalLiabilities = this.calculateTotalLiabilityValue(liability);
    const totalNetworth = totalAssets - totalLiabilities;
    return {
      totalNetworth,
      totalAssets,
      totalLiabilities,
    };
  }

  public async getLiabilityAndAssetProfile(
    userId: string,
  ): Promise<[AssetEntity | undefined, LiabilityEntity | undefined]> {
    const assetPromise = this.assetRepo.findOne({ userId });
    const liabilityPromise = this.liabilityRepo.findOne({ userId });
    return Promise.all([assetPromise, liabilityPromise]);
  }

  public async createInitialAssetAndLiability(
    userId: string,
  ): Promise<[AssetEntity, LiabilityEntity]> {
    const assetPromise = this.createInitialAssetProfile(userId);
    const liabilityPromise = this.createInitialLiabilityProfile(userId);
    return Promise.all([assetPromise, liabilityPromise]);
  }

  public async createInitialAssetProfile(userId: string): Promise<AssetEntity> {
    const asset = this.assetRepo.create({ userId });
    return this.assetRepo.save(asset);
  }

  public async createInitialLiabilityProfile(userId: string): Promise<LiabilityEntity> {
    const liability = this.liabilityRepo.create({ userId });
    return this.liabilityRepo.save(liability);
  }

  private calculateTotalAssetValue(asset: AssetEntity) {
    return (
      asset.chequing +
      asset.savingsForTaxes +
      asset.rainyDayFund +
      asset.savingsForFun +
      asset.savingsForTravel +
      asset.savingsForPersonalDevelopment +
      asset.investment1 +
      asset.investment2 +
      asset.investment3 +
      asset.primaryHome +
      asset.secondaryHome +
      asset.other
    );
  }

  private calculateTotalLiabilityValue(liability: LiabilityEntity) {
    return (
      liability.creditCard1 +
      liability.creditCard2 +
      liability.mortgage1 +
      liability.mortgage2 +
      liability.lineOfCredit +
      liability.investmentLoan
    );
  }
}
