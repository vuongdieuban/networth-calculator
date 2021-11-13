import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserUnauthenticatedError } from 'src/app/shared/auth/errors/auth.error';
import { UnknownHttpError } from 'src/app/shared/auth/errors/generic-http.error';
import { environment } from 'src/environments/environment';
import { CalculateNetworthRequest } from '../../dtos/calculate-networth-request.dto';
import { NetworthViewResponseDto } from '../../dtos/networth-view-response.dto';
import { UserSelectedCurrency } from '../../dtos/user-selected-currency.dto';
import { NetworthViewModel } from '../../view-models/networth-view.model';
import { NetworthViewAdapterService } from '../view-adapter/networth-view-adapter.service';

@Injectable({
  providedIn: 'root',
})
export class NetworthService {
  private readonly BACKEND_BASE_URL = environment.backendBaseUrl;
  constructor(
    private readonly httpService: HttpClient,
    private readonly viewAdapter: NetworthViewAdapterService
  ) {}

  public getUserSelectedCurrency(): Observable<UserSelectedCurrency> {
    const url = new URL('/currency', this.BACKEND_BASE_URL).toString();
    return this.httpService
      .get<UserSelectedCurrency>(url)
      .pipe(catchError((error: HttpErrorResponse) => this.handleHttpError(error)));
  }

  public getOrCreateNetworthProfile(): Observable<NetworthViewModel> {
    const url = new URL('/networth', this.BACKEND_BASE_URL).toString();
    return this.httpService.get<NetworthViewResponseDto>(url).pipe(
      map((response) => this.viewAdapter.convertNetworthApiResponseToViewModel(response)),
      catchError((error: HttpErrorResponse) => this.handleHttpError(error))
    );
  }

  public calculateNetworthProfile(
    payload: CalculateNetworthRequest
  ): Observable<NetworthViewModel> {
    const url = new URL('/networth/calculate', this.BACKEND_BASE_URL).toString();
    return this.httpService.post<NetworthViewResponseDto>(url, payload).pipe(
      map((response) => this.viewAdapter.convertNetworthApiResponseToViewModel(response)),
      catchError((error: HttpErrorResponse) => this.handleHttpError(error))
    );
  }

  private handleHttpError(error: HttpErrorResponse) {
    if (error.status === 401) {
      return throwError(new UserUnauthenticatedError());
    }
    console.error('UnknownHttpError', error);
    return throwError(new UnknownHttpError());
  }
}
