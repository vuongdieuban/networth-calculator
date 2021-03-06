import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSelectedCurrencyEntity } from 'src/networth/entities/user-selected-currency.entity';
import { CurrencyType } from 'src/shared/constants/currency-type.enum';
import { Repository } from 'typeorm';

@Injectable()
export class SelectedCurrencyService {
  constructor(
    @InjectRepository(UserSelectedCurrencyEntity)
    private readonly selectedCurrencyRepo: Repository<UserSelectedCurrencyEntity>,
  ) {}

  public getAllSupportedCurrencies() {
    return Object.values(CurrencyType);
  }

  public async getUserSelectedCurrency(
    userId: string,
  ): Promise<UserSelectedCurrencyEntity | undefined> {
    return this.selectedCurrencyRepo.findOne({ userId });
  }

  public async createSelectedCurrencyProfile(userId: string): Promise<UserSelectedCurrencyEntity> {
    const selectedCurrency = this.selectedCurrencyRepo.create({ userId });
    return this.selectedCurrencyRepo.save(selectedCurrency);
  }

  public async updateSelectedCurrencyProfile(
    userId: string,
    currency: CurrencyType,
  ): Promise<UserSelectedCurrencyEntity | undefined> {
    const currentSelectedCurrency = await this.selectedCurrencyRepo.findOne({ userId });
    if (!currentSelectedCurrency) {
      return undefined;
    }
    return this.selectedCurrencyRepo.save({ ...currentSelectedCurrency, currency });
  }
}
