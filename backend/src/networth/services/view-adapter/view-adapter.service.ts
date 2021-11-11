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
      totalNetworth: this.formatNumberToDisplayString(totalNetworth),
      totalAssets: this.formatNumberToDisplayString(totalAssets),
      totalLiabilities: this.formatNumberToDisplayString(totalLiabilities),
      assets: {
        cashAndInvestments: [
          {
            label: 'Chequing',
            fieldName: 'chequing',
            amount: this.formatNumberToDisplayString(asset.chequing),
          },
          {
            label: 'Savings For Taxes',
            fieldName: 'savingsForTaxes',
            amount: this.formatNumberToDisplayString(asset.savingsForTaxes),
          },
          {
            label: 'Rainy Day Fund',
            fieldName: 'rainyDayFund',
            amount: this.formatNumberToDisplayString(asset.rainyDayFund),
          },
          {
            label: 'Savings For Fun',
            fieldName: 'savingsForFun',
            amount: this.formatNumberToDisplayString(asset.savingsForFun),
          },
          {
            label: 'Savings For Travel',
            fieldName: 'savingsForTravel',
            amount: this.formatNumberToDisplayString(asset.savingsForTravel),
          },
          {
            label: 'Savings For Personal Development',
            fieldName: 'savingsForPersonalDevelopment',
            amount: this.formatNumberToDisplayString(asset.savingsForPersonalDevelopment),
          },
          {
            label: 'Investment 1',
            fieldName: 'investment1',
            amount: this.formatNumberToDisplayString(asset.investment1),
          },
          {
            label: 'Investment 2',
            fieldName: 'investment2',
            amount: this.formatNumberToDisplayString(asset.investment2),
          },
          {
            label: 'Investment 3',
            fieldName: 'investment3',
            amount: this.formatNumberToDisplayString(asset.investment3),
          },
        ],
        longTermAssets: [
          {
            label: 'Primary Home',
            fieldName: 'primaryHome',
            amount: this.formatNumberToDisplayString(asset.primaryHome),
          },
          {
            label: 'Secondary Home',
            fieldName: 'secondaryHome',
            amount: this.formatNumberToDisplayString(asset.secondaryHome),
          },
          {
            label: 'Other',
            fieldName: 'other',
            amount: this.formatNumberToDisplayString(asset.other),
          },
        ],
      },
      liabilities: {
        shortermLiabilities: [
          {
            label: 'Credit Card 1',
            fieldName: 'creditCard1',
            amount: this.formatNumberToDisplayString(liability.creditCard1),
            monthlyPayment: this.formatNumberToDisplayString(liability.creditCard1MonthlyPayment),
          },
          {
            label: 'Credit Card 2',
            fieldName: 'creditCard2',
            amount: this.formatNumberToDisplayString(liability.creditCard2),
            monthlyPayment: this.formatNumberToDisplayString(liability.creditCard2MonthlyPayment),
          },
        ],
        longTermDebts: [
          {
            label: 'Mortgage 1',
            fieldName: 'mortgage1',
            amount: this.formatNumberToDisplayString(liability.mortgage1),
            monthlyPayment: this.formatNumberToDisplayString(liability.mortgage1MonthlyPayment),
          },
          {
            label: 'Mortgage 2',
            fieldName: 'mortgage2',
            amount: this.formatNumberToDisplayString(liability.mortgage2),
            monthlyPayment: this.formatNumberToDisplayString(liability.mortgage2MonthlyPayment),
          },
          {
            label: 'Line Of Credit',
            fieldName: 'lineOfCredit',
            amount: this.formatNumberToDisplayString(liability.lineOfCredit),
            monthlyPayment: this.formatNumberToDisplayString(liability.lineOfCreditMonthlyPayment),
          },
          {
            label: 'Investment Loan',
            fieldName: 'investmentLoan',
            amount: this.formatNumberToDisplayString(liability.investmentLoan),
            monthlyPayment: this.formatNumberToDisplayString(
              liability.investmentLoanMonthlyPayment,
            ),
          },
        ],
      },
    };
  }

  private formatNumberToDisplayString(amount: number): string {
    return amount.toFixed(2);
  }
}
