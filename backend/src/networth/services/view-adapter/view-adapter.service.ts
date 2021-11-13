import { Injectable } from '@nestjs/common';
import { NetworthViewResponseDto } from 'src/networth/dtos/networth-view-response';
import { NetworthProfile } from '../networth/networth.service';

@Injectable()
export class ViewAdapterService {
  public formatNetworthProfileToViewResponse(profile: NetworthProfile): NetworthViewResponseDto {
    const { networthValues, asset, liability, selectedCurrency } = profile;
    const { totalAssets, totalLiabilities, totalNetworth } = networthValues;

    return {
      selectedCurrency,
      totalNetworth: this.convertNumberToDisplayString(totalNetworth),
      totalAssets: this.convertNumberToDisplayString(totalAssets),
      totalLiabilities: this.convertNumberToDisplayString(totalLiabilities),
      assets: {
        chequing: this.convertNumberToDisplayString(asset.chequing),
        savingsForTaxes: this.convertNumberToDisplayString(asset.savingsForTaxes),
        rainyDayFund: this.convertNumberToDisplayString(asset.rainyDayFund),
        savingsForFun: this.convertNumberToDisplayString(asset.savingsForFun),
        savingsForTravel: this.convertNumberToDisplayString(asset.savingsForTravel),
        savingsForPersonalDevelopment: this.convertNumberToDisplayString(
          asset.savingsForPersonalDevelopment,
        ),
        investment1: this.convertNumberToDisplayString(asset.investment1),
        investment2: this.convertNumberToDisplayString(asset.investment2),
        investment3: this.convertNumberToDisplayString(asset.investment3),
        primaryHome: this.convertNumberToDisplayString(asset.primaryHome),
        secondaryHome: this.convertNumberToDisplayString(asset.secondaryHome),
        other: this.convertNumberToDisplayString(asset.other),
      },
      liabilities: {
        creditCard1: this.convertNumberToDisplayString(liability.creditCard1),
        creditCard1MonthlyPayment: this.convertNumberToDisplayString(
          liability.creditCard1MonthlyPayment,
        ),
        creditCard2: this.convertNumberToDisplayString(liability.creditCard2),
        creditCard2MonthlyPayment: this.convertNumberToDisplayString(
          liability.creditCard2MonthlyPayment,
        ),
        mortgage1: this.convertNumberToDisplayString(liability.mortgage1),
        mortgage1MonthlyPayment: this.convertNumberToDisplayString(
          liability.mortgage1MonthlyPayment,
        ),
        mortgage2: this.convertNumberToDisplayString(liability.mortgage2),
        mortgage2MonthlyPayment: this.convertNumberToDisplayString(
          liability.mortgage2MonthlyPayment,
        ),
        lineOfCredit: this.convertNumberToDisplayString(liability.lineOfCredit),
        lineOfCreditMonthlyPayment: this.convertNumberToDisplayString(
          liability.lineOfCreditMonthlyPayment,
        ),
        investmentLoan: this.convertNumberToDisplayString(liability.investmentLoan),
        investmentLoanMonthlyPayment: this.convertNumberToDisplayString(
          liability.investmentLoanMonthlyPayment,
        ),
      },
    };
  }

  private convertNumberToDisplayString(amount: number): string {
    return amount.toFixed(2);
  }
}
