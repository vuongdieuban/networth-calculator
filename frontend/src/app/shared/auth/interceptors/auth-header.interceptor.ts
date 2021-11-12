import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const tokenCredentials = this.authService.tokenCredentials;
    if (!tokenCredentials) {
      return next.handle(request);
    }

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${tokenCredentials.accessToken}`,
      },
    });
    return next.handle(request);
  }
}
