import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { UserCredentialsInput } from '../../models/user-credentials-input.model';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<UserCredentialsInput>();

  public loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor() {}

  ngOnInit(): void {}

  public onSubmit(): void {
    const { username, password } = this.loginForm.value;
    this.formSubmitted.emit({ username, password });
  }
}
