import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetInput } from 'src/networth/dtos/calculate-networth-request.dto';
import { AssetEntity } from 'src/networth/entities/asset.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(AssetEntity)
    private readonly assetRepo: Repository<AssetEntity>,
  ) {}

  public async findAssetProfileByUser(userId: string): Promise<AssetEntity | undefined> {
    return this.assetRepo.findOne({ userId });
  }

  public async createInitialAssetProfile(userId: string): Promise<AssetEntity> {
    const asset = this.assetRepo.create({ userId });
    return this.assetRepo.save(asset);
  }

  public calculateTotalAssetValue(asset: AssetEntity) {
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

  public async updateAssetWithNewRateAndInput(
    userId: string,
    rate: number,
    assetInput: AssetInput,
  ): Promise<AssetEntity | undefined> {
    const currentAsset = await this.assetRepo.findOne({ userId });
    if (!currentAsset) {
      return undefined;
    }
    return this.assetRepo.save({
      ...currentAsset,
      chequing: assetInput.chequing * rate,
      savingsForTaxes: assetInput.savingsForTaxes * rate,
      rainyDayFund: assetInput.rainyDayFund * rate,
      savingsForFun: assetInput.savingsForFun * rate,
      savingsForTravel: assetInput.savingsForTravel * rate,
      savingsForPersonalDevelopment: assetInput.savingsForPersonalDevelopment * rate,
      investment1: assetInput.investment1 * rate,
      investment2: assetInput.investment2 * rate,
      investment3: assetInput.investment3 * rate,
      primaryHome: assetInput.primaryHome * rate,
      secondaryHome: assetInput.secondaryHome * rate,
      other: assetInput.other * rate,
    });
  }
}
