import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { mockNetworthData } from '../../dtos/mock-networth-data';
import {
  CurrencyType,
  NetworthViewResponse,
  ViewAssetCategories,
  ViewLiabilityCategories,
} from '../../dtos/networth-view-data.dto';

@Component({
  selector: 'app-networth-table',
  templateUrl: './networth-table.component.html',
  styleUrls: ['./networth-table.component.scss'],
})
export class NetworthTableComponent implements OnInit {
  private readonly currencyPattern = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
  private readonly formFieldValidators = [
    Validators.required,
    Validators.pattern(this.currencyPattern),
  ];

  public form = new FormGroup({
    chequing: new FormControl('', this.formFieldValidators),
    savingsForTaxes: new FormControl('', this.formFieldValidators),
  });

  // should fetch currencies from backend, remove currency type enum.
  public currencies = Object.values(CurrencyType) as string[];

  public assets: ViewAssetCategories = mockNetworthData.assets;
  public liabilities: ViewLiabilityCategories = mockNetworthData.liabilities;
  public networthData: NetworthViewResponse = mockNetworthData as NetworthViewResponse;

  ngOnInit() {
    const formGroup: Record<string, AbstractControl> = {};

    this.assets.cashAndInvestments.forEach((asset) => {
      formGroup[asset.fieldName] = new FormControl(asset.amount, this.formFieldValidators);
    });
    this.assets.longTermAssets.forEach((asset) => {
      formGroup[asset.fieldName] = new FormControl(asset.amount, this.formFieldValidators);
    });
    this.liabilities.longTermDebts.forEach((asset) => {
      formGroup[asset.fieldName] = new FormControl(asset.amount, this.formFieldValidators);
    });
    this.liabilities.shortermLiabilities.forEach((asset) => {
      formGroup[asset.fieldName] = new FormControl(asset.amount, this.formFieldValidators);
    });

    this.form = new FormGroup(formGroup);
  }

  public onSubmit() {
    console.log('Chequing', this.form.get('chequing')?.value);
    console.log('FORM VALUES', this.form.value);
  }
}
