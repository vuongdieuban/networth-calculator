export class NetworthViewResponseDto {
  selectedCurrency: string;
  totalNetworth: string;
  totalLiabilities: string;
  totalAssets: string;
  assets: {
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
  };
  liabilities: {
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
  };
}
