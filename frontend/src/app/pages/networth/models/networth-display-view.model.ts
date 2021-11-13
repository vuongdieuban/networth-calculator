export class AssetViewDetails {
  label: string;
  fieldName: string;
  amount: string;
}

export class LiabilityViewDetails {
  label: string;
  fieldName: string;
  amount: string;
  monthlyPayment: string;
}

export class AssetCategories {
  cashAndInvestments: AssetViewDetails[];
  longTermAssets: AssetViewDetails[];
}

export class LiabilityCategories {
  shortermLiabilities: LiabilityViewDetails[];
  longTermDebts: LiabilityViewDetails[];
}

export class NetworthDisplayViewModel {
  selectedCurrency: string;
  totalNetworth: string;
  totalLiabilities: string;
  totalAssets: string;
  assets: AssetCategories;
  liabilities: LiabilityCategories;
}
