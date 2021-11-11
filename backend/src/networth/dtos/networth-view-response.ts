import { CurrencyType } from 'src/shared/constants/currency-type.enum';

export class ViewAssetType {
  label: string;
  fieldName: string;
  amount: string; // for display purpose "5.00"
}

export class ViewLiabilityType {
  label: string;
  fieldName: string;
  amount: string;
  monthlyPayment: string;
}

export class NetworthViewResponseDto {
  selectedCurrency: CurrencyType;
  totalNetworth: string;
  totalLiabilities: string;
  totalAssets: string;
  assets: {
    cashAndInvestments: ViewAssetType[];
    longTermAssets: ViewAssetType[];
  };
  liabilities: {
    shortermLiabilities: ViewLiabilityType[];
    longTermDebts: ViewLiabilityType[];
  };
}
