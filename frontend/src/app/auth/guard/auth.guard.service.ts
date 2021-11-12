import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserUnauthenticatedError } from '../errors/auth.error';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  public canActivate(): Observable<boolean | UrlTree> {
    const isUserAuthenticated = this.authService.isUserAuthenticated();
    if (isUserAuthenticated) {
      return of(true);
    }
    // attempt to get access token thru refresh token in cookie
    return this.authService.renewToken().pipe(
      map((userId) => true),
      catchError((error) => this.handleRenewTokenError(error))
    );
  }

  private handleRenewTokenError(error: Error) {
    if (error instanceof UserUnauthenticatedError) {
      return of(this.router.parseUrl('/login'));
    }
    return of(this.router.parseUrl('/error'));
  }
}
