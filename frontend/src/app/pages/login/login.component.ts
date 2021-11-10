import { Component, OnInit } from '@angular/core';

type FormName = 'Login' | 'Register';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public selectedForm: FormName = 'Login';

  constructor() {}

  ngOnInit(): void {}

  public handleButtonSelected(selectedValue: FormName) {
    this.selectedForm = selectedValue;
    console.log(selectedValue);
  }
}
