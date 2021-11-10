import { Component, OnInit } from '@angular/core';
import { UserCredentialsInput } from './components/interfaces/user-credentials-input.interface';

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

  public handleFormTypeSelected(selectedValue: FormName) {
    this.selectedForm = selectedValue;
    console.log(selectedValue);
  }

  public handleRegisterFormSubmitted(userCredentials: UserCredentialsInput) {
    console.log('RegisterFormSubmitted', userCredentials);
  }

  public handleLoginFormSubmitted(userCredentials: UserCredentialsInput) {
    console.log('LoginFormSubmitted', userCredentials);
  }
}
