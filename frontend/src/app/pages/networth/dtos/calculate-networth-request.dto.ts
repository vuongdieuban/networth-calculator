export class AssetInput {
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
}

export class LiabilityInput {
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
}

export class CalculateNetworthRequest {
  fromCurrency: string;
  toCurrency: string;
  assets: AssetInput;
  liabilities: LiabilityInput;
}
