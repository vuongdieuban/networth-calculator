import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';

@Component({
  selector: 'app-networth',
  templateUrl: './networth.component.html',
  styleUrls: ['./networth.component.scss'],
})
export class NetworthComponent implements OnInit {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  ngOnInit(): void {}

  public handleLogoutClick() {
    this.authService.logout().subscribe(() => {
      console.log('go back to login page');
      this.router.navigate(['login']);
    });
  }
}
