import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { UserNotFoundError, UserUnauthenticatedError } from 'src/app/shared/auth/errors/auth.error';
import { AuthService } from 'src/app/shared/auth/service/auth.service';
import { UserCredentialsInput } from './models/user-credentials-input.model';

type FormName = 'Login' | 'Register';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public selectedForm: FormName = 'Login';
  public errorMsg = '';

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  ngOnInit(): void {}

  public handleFormTypeSelected(selectedValue: FormName) {
    this.clearErrorMessage();
    this.selectedForm = selectedValue;
  }

  public handleRegisterFormSubmitted(userCredentials: UserCredentialsInput) {
    this.clearErrorMessage();
    const { username, password } = userCredentials;
    this.authService
      .register(username, password)
      .pipe(switchMap(() => this.authService.login(username, password)))
      .subscribe(
        () => this.router.navigate(['/networth']),
        () => this.router.navigate(['/error'])
      );
  }

  public handleLoginFormSubmitted(userCredentials: UserCredentialsInput) {
    this.clearErrorMessage();
    const { username, password } = userCredentials;
    this.authService.login(username, password).subscribe(
      () => this.router.navigate(['/networth']),
      (error) => this.handleLoginError(username, error)
    );
  }

  private handleLoginError(username: string, error: Error) {
    if (error instanceof UserUnauthenticatedError) {
      this.errorMsg = 'Invalid Username or Password';
      return;
    }

    if (error instanceof UserNotFoundError) {
      this.errorMsg = `User with username ${username} not found. Please register account first`;
      return;
    }
    this.router.navigate(['/error']);
  }

  private clearErrorMessage() {
    this.errorMsg = '';
  }
}
