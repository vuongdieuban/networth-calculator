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
    return this.authService.renewAccessToken().pipe(
      map((userId) => true),
      catchError((error) => this.handleRenewAccessTokenError(error))
    );
  }

  private handleRenewAccessTokenError(error: Error) {
    if (error instanceof UserUnauthenticatedError) {
      return of(this.router.parseUrl('/login'));
    }
    return of(this.router.parseUrl('/error'));
  }
}
