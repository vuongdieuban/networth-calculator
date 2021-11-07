export class NetworthViewResponseDto {
  // selected currency
  // currency exchange rates
  // rates provider
  totalNetworth: number;
  assets: {
    totalAssets: number;
    cashAndInvestments: {
      chequing: number;
      savingsForTaxes: number;
      rainyDayFund: number;
      savingsForFun: number;
      savingsForTravel: number;
      savingsForPersonalDevelopment: number;
      investment1: number;
      investment2: number;
      investment3: number;
    };
    longTermAssets: {
      primaryHome: number;
      secondaryHome: number;
      other: number;
    };
  };
  liabilities: {
    totalLiabilities: number;
    shortTermLiabilities: {
      creditCard1: number;
      creditCard1MonthlyPayment: number;
      creditCard2: number;
      creditCard2MonthlyPayment: number;
    };
    longTermDebt: {
      mortgage1: number;
      mortgage1MonthlyPayment: number;
      mortgage2: number;
      mortgage2MonthlyPayment: number;
      lineOfCredit: number;
      lineOfCreditMonthlyPayment: number;
      investmentLoan: number;
      investmentLoanMonthlyPayment: number;
    };
  };
}
