import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { CalculateNetworthRequest } from '../../dtos/calculate-networth-request.dto';
import {
  AssetViewDetails,
  LiabilityViewDetails,
  NetworthViewModel,
} from '../../view-models/networth-view.model';

@Component({
  selector: 'app-networth-table',
  templateUrl: './networth-table.component.html',
  styleUrls: ['./networth-table.component.scss'],
})
export class NetworthTableComponent implements OnInit {
  @Input() selectedCurrency: string = '';
  @Input() supportedCurrencies: string[] = [];
  @Input() networthViewData: NetworthViewModel;

  @Output() calculateNetworthSubmitted = new EventEmitter<CalculateNetworthRequest>();

  public currentViewCurrency = '';
  public networthForm: FormGroup;
  public currencyFormControl: FormControl;

  private readonly currencyPattern = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
  private readonly formFieldValidators = [
    Validators.required,
    Validators.pattern(this.currencyPattern),
  ];

  ngOnInit() {
    if (this.networthViewData) {
      this.generateFormGroupFromNetworthViewModel();
    }
    if (this.selectedCurrency) {
      this.currentViewCurrency = this.selectedCurrency;
      this.currencyFormControl = new FormControl(this.currentViewCurrency);
    }
  }

  public onSubmit() {
    const request = {} as CalculateNetworthRequest;
    request.fromCurrency = 'CAD';
    request.toCurrency = 'USD';

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

  private getFormFieldValue(field: string) {
    return parseFloat(this.networthForm.value[field]);
  }
}
