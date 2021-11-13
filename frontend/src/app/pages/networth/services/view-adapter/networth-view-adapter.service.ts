import { Injectable } from '@angular/core';
import { NetworthViewResponseDto } from '../../dtos/networth-view-response.dto';
import { NetworthViewModel } from '../../view-models/networth-view.model';

@Injectable({
  providedIn: 'root',
})
export class NetworthViewAdapterService {
  constructor() {}

  public convertNetworthApiResponseToViewModel(
    apiResponse: NetworthViewResponseDto
  ): NetworthViewModel {
    const { assets, liabilities, totalAssets, totalLiabilities, totalNetworth, selectedCurrency } =
      apiResponse;

    const view: NetworthViewModel = {
      totalAssets,
      totalLiabilities,
      totalNetworth,
      selectedCurrency,
      assets: {
        cashAndInvestments: [],
        longTermAssets: [],
      },
      liabilities: {
        shortermLiabilities: [],
        longTermDebts: [],
      },
    };

    view.assets = {
      cashAndInvestments: [
        {
          label: 'Chequing',
          fieldName: 'chequing',
          amount: assets.chequing,
        },
        {
          label: 'Savings For Taxes',
          fieldName: 'savingsForTaxes',
          amount: assets.savingsForTaxes,
        },
        {
          label: 'Rainy Day Fund',
          fieldName: 'rainyDayFund',
          amount: assets.rainyDayFund,
        },
        {
          label: 'Savings For Fun',
          fieldName: 'savingsForFun',
          amount: assets.savingsForFun,
        },
        {
          label: 'Savings For Travel',
          fieldName: 'savingsForTravel',
          amount: assets.savingsForTravel,
        },
        {
          label: 'Savings For Personal Development',
          fieldName: 'savingsForPersonalDevelopment',
          amount: assets.savingsForPersonalDevelopment,
        },
        {
          label: 'Investment 1',
          fieldName: 'investment1',
          amount: assets.investment1,
        },
        {
          label: 'Investment 2',
          fieldName: 'investment2',
          amount: assets.investment2,
        },
        {
          label: 'Investment 3',
          fieldName: 'investment3',
          amount: assets.investment3,
        },
      ],
      longTermAssets: [
        {
          label: 'Primary Home',
          fieldName: 'primaryHome',
          amount: assets.primaryHome,
        },
        {
          label: 'Secondary Home',
          fieldName: 'secondaryHome',
          amount: assets.secondaryHome,
        },
        {
          label: 'Other',
          fieldName: 'other',
          amount: assets.other,
        },
      ],
    };

    view.liabilities = {
      shortermLiabilities: [
        {
          label: 'Credit Card 1',
          fieldName: 'creditCard1',
          amount: liabilities.creditCard1,
          monthlyPayment: liabilities.creditCard1MonthlyPayment,
        },
        {
          label: 'Credit Card 2',
          fieldName: 'creditCard2',
          amount: liabilities.creditCard2,
          monthlyPayment: liabilities.creditCard2MonthlyPayment,
        },
      ],
      longTermDebts: [
        {
          label: 'Mortgage 1',
          fieldName: 'mortgage1',
          amount: liabilities.mortgage1,
          monthlyPayment: liabilities.mortgage1MonthlyPayment,
        },
        {
          label: 'Mortgage 2',
          fieldName: 'mortgage2',
          amount: liabilities.mortgage2,
          monthlyPayment: liabilities.mortgage2MonthlyPayment,
        },
        {
          label: 'Line Of Credit',
          fieldName: 'lineOfCredit',
          amount: liabilities.lineOfCredit,
          monthlyPayment: liabilities.lineOfCreditMonthlyPayment,
        },
        {
          label: 'Investment Loan',
          fieldName: 'investmentLoan',
          amount: liabilities.investmentLoan,
          monthlyPayment: liabilities.investmentLoanMonthlyPayment,
        },
      ],
    };

    return view;
  }
}
