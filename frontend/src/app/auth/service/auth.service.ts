import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RenewTokenResponse } from '../dtos/renew-token-response.dto';
import { catchError, map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly BACKEND_BASE_URL = environment.backendBaseUrl;
  private accessToken: string = '';
  private userId: string = '';

  constructor(private readonly httpService: HttpClient) {}

  public isAuthenticated(): Observable<boolean> {
    return this.getAccessToken().pipe(
      map((tokenData) => (tokenData ? true : false)),
      catchError((_) => of(false))
    );
  }

  public register() {}

  public login() {}

  public logout() {}

  private getAccessToken(): Observable<RenewTokenResponse | undefined> {
    const url = `${this.BACKEND_BASE_URL}/auth/renew-token`;
    return this.httpService.post<RenewTokenResponse>(url, {}).pipe(
      take(1),
      tap((tokenData) => this.extractAndSaveTokenData(tokenData)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return of(undefined);
        }
        return throwError(error);
      })
    );
  }

  private extractAndSaveTokenData(tokenData: RenewTokenResponse | undefined) {
    if (!tokenData) {
      return;
    }
    this.accessToken = tokenData.accessToken;
    this.userId = tokenData.userId;
  }
}
