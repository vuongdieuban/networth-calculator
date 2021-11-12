import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserCredentialsResponse } from '../dtos/user-credentials-response.dto';
import { catchError, map, tap } from 'rxjs/operators';
import {
  UnknownAuthenticationError,
  UserNotFoundError,
  UserUnauthenticatedError,
} from '../errors/auth.error';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly BACKEND_BASE_URL = environment.backendBaseUrl;
  private _accessToken: string = '';
  private _userId: string = '';

  constructor(private readonly httpService: HttpClient) {}

  public get userId() {
    return this._userId;
  }

  public get accessToken() {
    return this._accessToken;
  }

  public renewAccessToken(): Observable<string> {
    const url = new URL('auth/renew-token', this.BACKEND_BASE_URL).toString();
    return this.httpService.post<UserCredentialsResponse>(url, {}).pipe(
      tap((tokenData) => this.extractAndSaveTokenData(tokenData)),
      map((tokenData) => tokenData.userId),
      catchError((error: HttpErrorResponse) => this.handleRenewAccessTokenErrorResponse(error))
    );
  }

  public register(username: string, password: string): Observable<string> {
    const url = new URL('auth/register', this.BACKEND_BASE_URL).toString();
    return this.httpService.post<{ userId: string }>(url, { username, password }).pipe(
      map(({ userId }) => userId),
      catchError((error: HttpErrorResponse) => this.handleRegisterErrorResponse(error))
    );
  }

  public login(username: string, password: string): Observable<string> {
    const url = new URL('auth/login', this.BACKEND_BASE_URL).toString();
    return this.httpService.post<UserCredentialsResponse>(url, { username, password }).pipe(
      tap((tokenData) => this.extractAndSaveTokenData(tokenData)),
      map((tokenData) => tokenData.userId),
      catchError((error: HttpErrorResponse) => this.handleLoginErrorResponse(error))
    );
  }

  public logout(): Observable<void> {
    const url = new URL('auth/logout', this.BACKEND_BASE_URL).toString();
    return this.httpService.post<void>(url, {}).pipe(tap(() => this.clearAccessTokenAndUserId()));
  }

  private extractAndSaveTokenData(tokenData: UserCredentialsResponse): void {
    this._accessToken = tokenData.accessToken;
    this._userId = tokenData.userId;
  }

  private handleLoginErrorResponse(error: HttpErrorResponse): Observable<never> {
    const { status } = error;
    if (status === 404) {
      return throwError(new UserNotFoundError());
    }
    if (status === 401) {
      return throwError(new UserUnauthenticatedError());
    }
    return throwError(new UnknownAuthenticationError(error.message));
  }

  private handleRenewAccessTokenErrorResponse(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      return throwError(new UserUnauthenticatedError());
    }
    return throwError(new UnknownAuthenticationError(error.message));
  }

  private handleRegisterErrorResponse(error: HttpErrorResponse): Observable<never> {
    return throwError(new UnknownAuthenticationError(error.message));
  }

  private clearAccessTokenAndUserId(): void {
    this._userId = '';
    this._accessToken = '';
  }
}
