import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CurrencyType } from '../../dtos/networth-data.interface';

@Component({
  selector: 'app-networth-table',
  templateUrl: './networth-table.component.html',
  styleUrls: ['./networth-table.component.scss'],
})
export class NetworthTableComponent implements OnInit {
  // should fetch currencies from backend, remove currency type enum.
  currencies = Object.values(CurrencyType) as string[];
  formFieldValidators = [
    Validators.required,
    Validators.pattern(/^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/),
  ];

  public form = new FormGroup({
    chequing: new FormControl('', this.formFieldValidators),
    savingsForTaxes: new FormControl('', this.formFieldValidators),
  });

  networthData = [
    { label: 'Chequing', formName: 'chequing' },
    { label: 'Savings For Taxes', formName: 'savingsForTaxes' },
  ];

  ngOnInit() {}

  onSubmit() {
    console.log('Chequing', this.form.get('chequing')?.value);
    console.log('FORM VALUES', this.form.value);
  }
}
