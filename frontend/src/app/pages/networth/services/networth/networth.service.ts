import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserUnauthenticatedError } from 'src/app/shared/auth/errors/auth.error';
import { UnknownHttpError } from 'src/app/shared/auth/errors/generic-http.error';
import { environment } from 'src/environments/environment';
import { CalculateNetworthRequest } from '../../dtos/calculate-networth-request.dto';
import { NetworthViewResponseDto } from '../../dtos/networth-view-response.dto';
import { NetworthDisplayViewModel } from '../../models/networth-display-view.model';
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

  public getSupportedCurrencies(): Observable<string[]> {
    const url = new URL('/networth/supported-currencies', this.BACKEND_BASE_URL).toString();
    return this.httpService
      .get<string[]>(url)
      .pipe(catchError((error: HttpErrorResponse) => this.handleHttpError(error)));
  }

  public getOrCreateNetworthProfile(): Observable<NetworthDisplayViewModel> {
    return this.getNetworthProfile().pipe(
      catchError((error: HttpErrorResponse) => this.handleProfileNotFoundError(error)),
      catchError((error: HttpErrorResponse) => this.handleHttpError(error)),
      map((response) => this.viewAdapter.convertNetworthApiResponseToViewModel(response))
    );
  }

  public calculateNetworthProfile(
    payload: CalculateNetworthRequest
  ): Observable<NetworthDisplayViewModel> {
    const url = new URL('/networth/calculate', this.BACKEND_BASE_URL).toString();
    return this.httpService.post<NetworthViewResponseDto>(url, payload).pipe(
      map((response) => this.viewAdapter.convertNetworthApiResponseToViewModel(response)),
      catchError((error: HttpErrorResponse) => this.handleHttpError(error))
    );
  }

  private getNetworthProfile(): Observable<NetworthViewResponseDto> {
    const url = new URL('/networth', this.BACKEND_BASE_URL).toString();
    return this.httpService.get<NetworthViewResponseDto>(url);
  }

  private createNetworthProfile(): Observable<NetworthViewResponseDto> {
    const url = new URL('/networth', this.BACKEND_BASE_URL).toString();
    return this.httpService.post<NetworthViewResponseDto>(url, {});
  }

  private handleProfileNotFoundError(error: HttpErrorResponse) {
    if (error.status === 404) {
      return this.createNetworthProfile();
    }
    return throwError(error);
  }

  private handleHttpError(error: HttpErrorResponse) {
    if (error.status === 401) {
      return throwError(new UserUnauthenticatedError());
    }
    console.error('UnknownHttpError', error);
    return throwError(new UnknownHttpError());
  }
}
