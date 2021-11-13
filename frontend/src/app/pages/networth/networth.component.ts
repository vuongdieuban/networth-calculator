import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { UserUnauthenticatedError } from 'src/app/shared/auth/errors/auth.error';
import { AuthService } from 'src/app/shared/auth/service/auth.service';
import { CalculateNetworthRequest } from './dtos/calculate-networth-request.dto';
import { UserSelectedCurrency } from './dtos/user-selected-currency.dto';
import { NetworthService } from './services/networth/networth.service';
import { NetworthDisplayViewModel } from './models/networth-display-view.model';

@Component({
  selector: 'app-networth',
  templateUrl: './networth.component.html',
  styleUrls: ['./networth.component.scss'],
})
export class NetworthComponent implements OnInit {
  public selectedCurrency = '';
  public supportedCurrencies: string[] = [];
  public networthViewData: NetworthDisplayViewModel;

  constructor(
    private readonly networthService: NetworthService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrencyAndNetworthData();
  }

  public handleLogoutClick() {
    this.authService.logout().subscribe(
      () => this.router.navigate(['login']),
      () => this.router.navigate(['error'])
    );
  }

  public handleCalculateNetworthSubmitted(request: CalculateNetworthRequest) {
    this.networthService.calculateNetworthProfile(request).subscribe((profile) => {
      this.networthViewData = profile;
      this.selectedCurrency = profile.selectedCurrency;
    });
  }

  private getCurrencyAndNetworthData() {
    this.networthService
      .getUserSelectedCurrency()
      .pipe(
        tap((selectedCurrency) => this.extractAndSaveSelectedCurrency(selectedCurrency)),
        switchMap(() => this.networthService.getOrCreateNetworthProfile())
      )
      .subscribe(
        (profile) => this.extractAndSaveNetworthProfile(profile),
        (error) => this.handleHttpError(error)
      );
  }

  private extractAndSaveSelectedCurrency(selectedCurrency: UserSelectedCurrency) {
    this.supportedCurrencies = selectedCurrency.supportedCurrencies;
    this.selectedCurrency = selectedCurrency.selectedCurrency;
  }

  private extractAndSaveNetworthProfile(profile: NetworthDisplayViewModel) {
    this.networthViewData = profile;
  }

  private handleHttpError(error: Error) {
    if (error instanceof UserUnauthenticatedError) {
      this.router.navigate(['login']);
      return;
    }
    this.router.navigate(['error']);
  }
}
