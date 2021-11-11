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

export class ViewAssetTypeDetails {
  label: string;
  fieldName: string;
  amount: string; // for display purpose "5.00"
}

export class ViewAssetCategories {
  cashAndInvestments: ViewAssetTypeDetails[];
  longTermAssets: ViewAssetTypeDetails[];
}

export class ViewLiabilityTypeDetails {
  label: string;
  fieldName: string;
  amount: string;
  monthlyPayment: string;
}

export class ViewLiabilityCategories {
  shortermLiabilities: ViewLiabilityTypeDetails[];
  longTermDebts: ViewLiabilityTypeDetails[];
}

export class NetworthViewResponseDto {
  selectedCurrency: CurrencyType;
  totalNetworth: string;
  totalLiabilities: string;
  totalAssets: string;
  assets: ViewAssetCategories;
  liabilities: ViewLiabilityCategories;
}
