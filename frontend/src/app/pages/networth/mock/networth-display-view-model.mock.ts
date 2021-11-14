import { NetworthDisplayViewModel } from '../models/networth-display-view.model';

export const supportedCurrenciesMock = ['CAD', 'USD', 'EUR'];
export const selectedCurrencyMock = 'USD';

export const networthDisplayViewModelMock: NetworthDisplayViewModel = {
  totalAssets: '1439216.06',
  totalLiabilities: '1439.21',
  totalNetworth: '1437776.85',
  selectedCurrency: selectedCurrencyMock,
  assets: {
    cashAndInvestments: [
      { label: 'Chequing', fieldName: 'chequing', amount: '1439213.00' },
      { label: 'Savings For Taxes', fieldName: 'savingsForTaxes', amount: '1.53' },
      { label: 'Rainy Day Fund', fieldName: 'rainyDayFund', amount: '1.53' },
      { label: 'Savings For Fun', fieldName: 'savingsForFun', amount: '0.00' },
      { label: 'Savings For Travel', fieldName: 'savingsForTravel', amount: '0.00' },
      {
        label: 'Savings For Personal Development',
        fieldName: 'savingsForPersonalDevelopment',
        amount: '0.00',
      },
      { label: 'Investment 1', fieldName: 'investment1', amount: '0.00' },
      { label: 'Investment 2', fieldName: 'investment2', amount: '0.00' },
      { label: 'Investment 3', fieldName: 'investment3', amount: '0.00' },
    ],
    longTermAssets: [
      { label: 'Primary Home', fieldName: 'primaryHome', amount: '0.00' },
      { label: 'Secondary Home', fieldName: 'secondaryHome', amount: '0.00' },
      { label: 'Other', fieldName: 'other', amount: '0.00' },
    ],
  },
  liabilities: {
    shortermLiabilities: [
      {
        label: 'Credit Card 1',
        fieldName: 'creditCard1',
        amount: '0.00',
        monthlyPayment: '141.16',
      },
      {
        label: 'Credit Card 2',
        fieldName: 'creditCard2',
        amount: '0.00',
        monthlyPayment: '105.90',
      },
    ],
    longTermDebts: [
      { label: 'Mortgage 1', fieldName: 'mortgage1', amount: '1439.21', monthlyPayment: '1411.72' },
      { label: 'Mortgage 2', fieldName: 'mortgage2', amount: '0.00', monthlyPayment: '2470.55' },
      {
        label: 'Line Of Credit',
        fieldName: 'lineOfCredit',
        amount: '0.00',
        monthlyPayment: '352.92',
      },
      {
        label: 'Investment Loan',
        fieldName: 'investmentLoan',
        amount: '0.00',
        monthlyPayment: '494.12',
      },
    ],
  },
};
