import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/service/auth.service';
import { UserCredentialsInput } from './interfaces/user-credentials-input.interface';

type FormName = 'Login' | 'Register';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public selectedForm: FormName = 'Login';

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  ngOnInit(): void {}

  public handleFormTypeSelected(selectedValue: FormName) {
    this.selectedForm = selectedValue;
    console.log(selectedValue);
  }

  public handleRegisterFormSubmitted(userCredentials: UserCredentialsInput) {
    const { username, password } = userCredentials;
    this.authService
      .register(username, password)
      .pipe(switchMap(() => this.authService.login(username, password)))
      .subscribe(
        () => this.router.navigate(['/networth']),
        () => this.router.navigate(['/error'])
      );
    console.log('RegisterFormSubmitted', userCredentials);
  }

  public handleLoginFormSubmitted(userCredentials: UserCredentialsInput) {
    console.log('LoginFormSubmitted', userCredentials);
  }
}
