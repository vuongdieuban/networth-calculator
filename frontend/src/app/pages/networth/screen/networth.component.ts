import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { UserUnauthenticatedError } from 'src/app/shared/auth/errors/auth.error';
import { AuthService } from 'src/app/shared/auth/service/auth.service';
import { CalculateNetworthRequest } from '../dtos/calculate-networth-request.dto';
import { NetworthDisplayViewModel } from '../models/networth-display-view.model';
import { NetworthService } from '../services/networth/networth.service';

@Component({
  selector: 'app-networth',
  templateUrl: './networth.component.html',
  styleUrls: ['./networth.component.scss'],
})
export class NetworthComponent implements OnInit {
  public selectedCurrency = '';
  public supportedCurrencies: string[] = [];
  public networthViewData: NetworthDisplayViewModel | undefined;

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
      .getSupportedCurrencies()
      .pipe(
        tap((selectedCurrency) => this.extractAndSaveSupportedCurrencies(selectedCurrency)),
        switchMap(() => this.networthService.getOrCreateNetworthProfile())
      )
      .subscribe(
        (profile) => this.extractAndSaveNetworthProfile(profile),
        (error) => this.handleHttpError(error)
      );
  }

  private extractAndSaveSupportedCurrencies(supportedCurrencies: string[]) {
    this.supportedCurrencies = supportedCurrencies;
  }

  private extractAndSaveNetworthProfile(profile: NetworthDisplayViewModel) {
    this.networthViewData = profile;
    this.selectedCurrency = profile.selectedCurrency;
  }

  private handleHttpError(error: Error) {
    if (error instanceof UserUnauthenticatedError) {
      this.router.navigate(['login']);
      return;
    }
    this.router.navigate(['error']);
  }
}
