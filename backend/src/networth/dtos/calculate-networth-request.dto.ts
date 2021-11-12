import { IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { CurrencyType } from 'src/currency/constants/currency-type.enum';

export class AssetInput {
  @IsNumber()
  chequing: number;

  @IsNumber()
  savingsForTaxes: number;

  @IsNumber()
  rainyDayFund: number;

  @IsNumber()
  savingsForFun: number;

  @IsNumber()
  savingsForTravel: number;

  @IsNumber()
  savingsForPersonalDevelopment: number;

  @IsNumber()
  investment1: number;

  @IsNumber()
  investment2: number;

  @IsNumber()
  investment3: number;

  @IsNumber()
  primaryHome: number;

  @IsNumber()
  secondaryHome: number;

  @IsNumber()
  other: number;
}

export class LiabilityInput {
  @IsNumber()
  creditCard1: number;

  @IsNumber()
  creditCard1MonthlyPayment: number;

  @IsNumber()
  creditCard2: number;

  @IsNumber()
  creditCard2MonthlyPayment: number;

  @IsNumber()
  mortgage1: number;

  @IsNumber()
  mortgage1MonthlyPayment: number;

  @IsNumber()
  mortgage2: number;

  @IsNumber()
  mortgage2MonthlyPayment: number;

  @IsNumber()
  lineOfCredit: number;

  @IsNumber()
  lineOfCreditMonthlyPayment: number;

  @IsNumber()
  investmentLoan: number;

  @IsNumber()
  investmentLoanMonthlyPayment: number;
}

export class CalculateNetworthRequestDto {
  @IsEnum(CurrencyType)
  fromCurrency: CurrencyType;

  @IsEnum(CurrencyType)
  toCurrency: CurrencyType;

  @ValidateNested()
  assets: AssetInput;

  @ValidateNested()
  liabilities: LiabilityInput;
}
