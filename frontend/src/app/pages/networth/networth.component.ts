import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/service/auth.service';

@Component({
  selector: 'app-networth',
  templateUrl: './networth.component.html',
  styleUrls: ['./networth.component.scss'],
})
export class NetworthComponent implements OnInit {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  ngOnInit(): void {}

  public handleLogoutClick() {
    this.authService.logout().subscribe(
      () => this.router.navigate(['login']),
      (err) => this.router.navigate(['error'])
    );
  }
}
