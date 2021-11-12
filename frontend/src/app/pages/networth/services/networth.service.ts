import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserUnauthenticatedError } from 'src/app/shared/auth/errors/auth.error';
import { UnknownHttpError } from 'src/app/shared/auth/errors/generic-http.error';
import { environment } from 'src/environments/environment';
import { CalculateNetworthRequest } from '../dtos/calculate-networth-request.dto';
import { NetworthViewResponse } from '../dtos/networth-view-data.dto';
import { UserSelectedCurrency } from '../dtos/user-selected-currency.dto';

@Injectable({
  providedIn: 'root',
})
export class NetworthService {
  private readonly BACKEND_BASE_URL = environment.backendBaseUrl;
  constructor(private readonly httpService: HttpClient) {}

  public getUserSelectedCurrency(): Observable<UserSelectedCurrency> {
    const url = new URL('/currency', this.BACKEND_BASE_URL).toString();
    return this.httpService
      .get<UserSelectedCurrency>(url)
      .pipe(catchError((error: HttpErrorResponse) => this.handleHttpError(error)));
  }

  public getOrCreateNetworthProfile(): Observable<NetworthViewResponse> {
    const url = new URL('/networth', this.BACKEND_BASE_URL).toString();
    return this.httpService
      .get<NetworthViewResponse>(url)
      .pipe(catchError((error: HttpErrorResponse) => this.handleHttpError(error)));
  }

  public calculateNetworthProfile(
    payload: CalculateNetworthRequest
  ): Observable<NetworthViewResponse> {
    const url = new URL('/networth/calculate', this.BACKEND_BASE_URL).toString();
    return this.httpService
      .post<NetworthViewResponse>(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => this.handleHttpError(error)));
  }

  private handleHttpError(error: HttpErrorResponse) {
    if (error.status === 401) {
      return throwError(new UserUnauthenticatedError());
    }
    console.error('UnknownHttpError', error);
    return throwError(new UnknownHttpError());
  }
}
