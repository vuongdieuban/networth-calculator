export enum CurrencyType {
  CAD = 'CAD',
  USD = 'USD',
  EUR = 'EUR',
  KYD = 'KYD',
  CNY = 'CNY',
  CHF = 'CHF',
  SGD = 'SGD',
  XRP = 'XRP',
  OMR = 'OMR',
  BYR = 'BYR',
  AZN = 'AZN',
}

export interface NetworthViewResponseDto {
  selectedCurrency: CurrencyType;
  totalNetworth: number;
  totalAssets: number;
  totalLiabilities: number;
  assets: {
    chequing: number;
    savingsForTaxes: number;
    rainyDayFund: number;
    savingsForFun: number;
    savingsForTravel: number;
    savingsForPersonalDevelopment: number;
    investment1: number;
    investment2: number;
    investment3: number;
    primaryHome: number;
    secondaryHome: number;
    other: number;
  };
  liabilities: {
    creditCard1: number;
    creditCard1MonthlyPayment: number;
    creditCard2: number;
    creditCard2MonthlyPayment: number;
    mortgage1: number;
    mortgage1MonthlyPayment: number;
    mortgage2: number;
    mortgage2MonthlyPayment: number;
    lineOfCredit: number;
    lineOfCreditMonthlyPayment: number;
    investmentLoan: number;
    investmentLoanMonthlyPayment: number;
  };
}
