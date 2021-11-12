import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UserCredentialsInput } from '../../interfaces/user-credentials-input.interface';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<UserCredentialsInput>();

  public registerForm = new FormGroup(
    {
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    },
    { validators: (control) => this.confirmPasswordValidator(control) }
  );

  constructor() {}

  ngOnInit(): void {}

  public onSubmit(): void {
    const { username, password } = this.registerForm.value;
    this.formSubmitted.emit({ username, password });
  }

  private confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      return { isPasswordMismatch: true };
    }
    return null;
  }
}
