import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenCredentialsInfo } from '../dtos/token-credentials-info.dto';
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
  private _tokenCredentialsInfo: TokenCredentialsInfo | undefined;

  constructor(private readonly httpService: HttpClient) {}

  public get tokenCredentials() {
    return this._tokenCredentialsInfo;
  }

  public isUserAuthenticated(): boolean {
    return Boolean(this._tokenCredentialsInfo);
  }

  public renewToken() {
    const url = new URL('auth/renew-token', this.BACKEND_BASE_URL).toString();
    return this.httpService.post<TokenCredentialsInfo>(url, {}).pipe(
      tap((credentials) => this.extractAndSaveTokenCredentials(credentials)),
      map((credentials) => credentials.userId),
      catchError((error: HttpErrorResponse) => this.handlerenewTokenErrorResponse(error))
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
    return this.httpService.post<TokenCredentialsInfo>(url, { username, password }).pipe(
      tap((credentials) => this.extractAndSaveTokenCredentials(credentials)),
      map((credentials) => credentials.userId),
      catchError((error: HttpErrorResponse) => this.handleLoginErrorResponse(error))
    );
  }

  public logout(): Observable<void> {
    const url = new URL('auth/logout', this.BACKEND_BASE_URL).toString();
    return this.httpService.post<void>(url, {}).pipe(tap(() => this.clearAccessTokenAndUserId()));
  }

  public clearStoredUserCredentials() {
    this.clearAccessTokenAndUserId();
  }

  private extractAndSaveTokenCredentials(crendentials: TokenCredentialsInfo): void {
    this._tokenCredentialsInfo = crendentials;
  }

  private handleLoginErrorResponse(error: HttpErrorResponse): Observable<never> {
    const { status } = error;
    if (status === 404) {
      return throwError(new UserNotFoundError());
    }
    if (status === 401) {
      return throwError(new UserUnauthenticatedError());
    }
    console.error('LoginError', error);
    return throwError(new UnknownAuthenticationError(error.message));
  }

  private handlerenewTokenErrorResponse(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      return throwError(new UserUnauthenticatedError());
    }
    console.error('renewTokenError', error);
    return throwError(new UnknownAuthenticationError(error.message));
  }

  private handleRegisterErrorResponse(error: HttpErrorResponse): Observable<never> {
    console.error('RegisterError', error);
    return throwError(new UnknownAuthenticationError(error.message));
  }

  private clearAccessTokenAndUserId(): void {
    this._tokenCredentialsInfo = undefined;
  }
}
