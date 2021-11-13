import { CurrencyType } from 'src/currency/constants/currency-type.enum';

export class ViewAssetCategories {
  chequing: string;
  savingsForTaxes: string;
  rainyDayFund: string;
  savingsForFun: string;
  savingsForTravel: string;
  savingsForPersonalDevelopment: string;
  investment1: string;
  investment2: string;
  investment3: string;
  primaryHome: string;
  secondaryHome: string;
  other: string;
}

export class ViewLiabilityCategories {
  creditCard1: string;
  creditCard1MonthlyPayment: string;
  creditCard2: string;
  creditCard2MonthlyPayment: string;
  mortgage1: string;
  mortgage1MonthlyPayment: string;
  mortgage2: string;
  mortgage2MonthlyPayment: string;
  lineOfCredit: string;
  lineOfCreditMonthlyPayment: string;
  investmentLoan: string;
  investmentLoanMonthlyPayment: string;
}

export class NetworthViewResponseDto {
  selectedCurrency: CurrencyType;
  totalNetworth: string;
  totalLiabilities: string;
  totalAssets: string;
  assets: ViewAssetCategories;
  liabilities: ViewLiabilityCategories;
}
