import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { CalculateNetworthRequest } from '../../dtos/calculate-networth-request.dto';
import { NetworthDisplayViewModel } from '../../models/networth-display-view.model';

@Component({
  selector: 'app-networth-table',
  templateUrl: './networth-table.component.html',
  styleUrls: ['./networth-table.component.scss'],
})
export class NetworthTableComponent implements OnInit, OnChanges {
  @Input() selectedCurrency: string = '';
  @Input() supportedCurrencies: string[] = [];
  @Input() networthViewData: NetworthDisplayViewModel;

  @Output() calculateNetworthSubmitted = new EventEmitter<CalculateNetworthRequest>();

  public networthForm: FormGroup;
  public currencyFormControl: FormControl;

  private monthlyPaymentData: Record<string, string> = {};
  private readonly currencyPattern = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
  private readonly formFieldValidators = [
    Validators.required,
    Validators.pattern(this.currencyPattern),
  ];

  ngOnInit() {
    if (this.networthViewData) {
      this.generateFormGroupFromNetworthViewModel();
      this.extractAndStoreMonthlyPaymentData(this.networthViewData);
    }
    if (this.selectedCurrency) {
      this.currencyFormControl = new FormControl(this.selectedCurrency);
    }
  }

  ngOnChanges() {
    this.generateFormGroupFromNetworthViewModel();
    this.extractAndStoreMonthlyPaymentData(this.networthViewData);
  }

  public onCalculateNetworthSubmit() {
    const request = this.convertViewDataIntoCalculateNetworthRequest();
    this.calculateNetworthSubmitted.emit(request);
  }

  private generateFormGroupFromNetworthViewModel() {
    const formGroup: Record<string, AbstractControl> = {};
    this.generateFormGroupFromAssetsViewModel(formGroup);
    this.generateFormGroupFromLiabilitiesViewModel(formGroup);

    this.networthForm = new FormGroup(formGroup);
  }

  private generateFormGroupFromAssetsViewModel(formGroup: Record<string, AbstractControl>) {
    const { assets } = this.networthViewData;

    assets.cashAndInvestments.forEach((asset) => {
      formGroup[asset.fieldName] = new FormControl(asset.amount, this.formFieldValidators);
    });
    assets.longTermAssets.forEach((asset) => {
      formGroup[asset.fieldName] = new FormControl(asset.amount, this.formFieldValidators);
    });
  }

  private generateFormGroupFromLiabilitiesViewModel(formGroup: Record<string, AbstractControl>) {
    const { liabilities } = this.networthViewData;

    liabilities.longTermDebts.forEach((liability) => {
      formGroup[liability.fieldName] = new FormControl(liability.amount, this.formFieldValidators);
    });
    liabilities.shortermLiabilities.forEach((liability) => {
      formGroup[liability.fieldName] = new FormControl(liability.amount, this.formFieldValidators);
    });
  }

  private extractAndStoreMonthlyPaymentData(networthData: NetworthDisplayViewModel) {
    networthData.liabilities.longTermDebts.forEach((liability) => {
      const { fieldName, monthlyPayment } = liability;
      this.monthlyPaymentData[fieldName] = monthlyPayment;
    });

    networthData.liabilities.shortermLiabilities.forEach((liability) => {
      const { fieldName, monthlyPayment } = liability;
      this.monthlyPaymentData[fieldName] = monthlyPayment;
    });
  }

  private convertViewDataIntoCalculateNetworthRequest() {
    const request = {} as CalculateNetworthRequest;
    request.fromCurrency = this.selectedCurrency;
    request.toCurrency = this.currencyFormControl.value;
    request.assets = {
      chequing: this.getFormFieldValue('chequing'),
      savingsForTaxes: this.getFormFieldValue('savingsForTaxes'),
      rainyDayFund: this.getFormFieldValue('rainyDayFund'),
      savingsForFun: this.getFormFieldValue('savingsForFun'),
      savingsForTravel: this.getFormFieldValue('savingsForTravel'),
      savingsForPersonalDevelopment: this.getFormFieldValue('savingsForPersonalDevelopment'),
      investment1: this.getFormFieldValue('investment1'),
      investment2: this.getFormFieldValue('investment2'),
      investment3: this.getFormFieldValue('investment3'),
      primaryHome: this.getFormFieldValue('primaryHome'),
      secondaryHome: this.getFormFieldValue('secondaryHome'),
      other: this.getFormFieldValue('other'),
    };

    request.liabilities = {
      creditCard1: this.getFormFieldValue('creditCard1'),
      creditCard1MonthlyPayment: this.getMonthlyPaymentFromFieldName('creditCard1'),
      creditCard2: this.getFormFieldValue('creditCard2'),
      creditCard2MonthlyPayment: this.getMonthlyPaymentFromFieldName('creditCard2'),
      mortgage1: this.getFormFieldValue('mortgage1'),
      mortgage1MonthlyPayment: this.getMonthlyPaymentFromFieldName('mortgage1'),
      mortgage2: this.getFormFieldValue('mortgage2'),
      mortgage2MonthlyPayment: this.getMonthlyPaymentFromFieldName('mortgage2'),
      lineOfCredit: this.getFormFieldValue('lineOfCredit'),
      lineOfCreditMonthlyPayment: this.getMonthlyPaymentFromFieldName('lineOfCredit'),
      investmentLoan: this.getFormFieldValue('investmentLoan'),
      investmentLoanMonthlyPayment: this.getMonthlyPaymentFromFieldName('investmentLoan'),
    };
    return request;
  }

  private getFormFieldValue(field: string) {
    return parseFloat(this.networthForm.value[field]);
  }

  private getMonthlyPaymentFromFieldName(field: string) {
    return parseFloat(this.monthlyPaymentData[field]);
  }
}
