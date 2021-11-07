import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LiabilityInput } from 'src/networth/dtos/calculate-networth-request.dto';
import { LiabilityEntity } from 'src/networth/entities/liability.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LiabilityService {
  constructor(
    @InjectRepository(LiabilityEntity)
    private readonly liabilityRepo: Repository<LiabilityEntity>,
  ) {}

  public async findLiabilityProfileByUser(userId: string): Promise<LiabilityEntity | undefined> {
    return this.liabilityRepo.findOne({ userId });
  }

  public async createInitialLiabilityProfile(userId: string): Promise<LiabilityEntity> {
    const liability = this.liabilityRepo.create({ userId });
    return this.liabilityRepo.save(liability);
  }

  public calculateTotalLiabilityValue(liability: LiabilityEntity) {
    return (
      liability.creditCard1 +
      liability.creditCard2 +
      liability.mortgage1 +
      liability.mortgage2 +
      liability.lineOfCredit +
      liability.investmentLoan
    );
  }

  public async updateLiabilityWithNewRateAndInput(
    userId: string,
    rate: number,
    liabilityInput: LiabilityInput,
  ): Promise<LiabilityEntity | undefined> {
    const currentLiability = await this.liabilityRepo.findOne({ userId });
    if (!currentLiability) {
      return undefined;
    }
    return this.liabilityRepo.save({
      ...currentLiability,
      creditCard1: liabilityInput.creditCard1 * rate,
      creditCard1MonthlyPayment: liabilityInput.creditCard1MonthlyPayment * rate,
      creditCard2: liabilityInput.creditCard2 * rate,
      creditCard2MonthlyPayment: liabilityInput.creditCard2MonthlyPayment * rate,
      mortgage1: liabilityInput.mortgage1 * rate,
      mortgage1MonthlyPayment: liabilityInput.mortgage1MonthlyPayment * rate,
      mortgage2: liabilityInput.mortgage2 * rate,
      mortgage2MonthlyPayment: liabilityInput.mortgage2MonthlyPayment * rate,
      lineOfCredit: liabilityInput.lineOfCredit * rate,
      lineOfCreditMonthlyPayment: liabilityInput.lineOfCreditMonthlyPayment * rate,
      investmentLoan: liabilityInput.investmentLoan * rate,
      investmentLoanMonthlyPayment: liabilityInput.investmentLoanMonthlyPayment * rate,
    });
  }
}
