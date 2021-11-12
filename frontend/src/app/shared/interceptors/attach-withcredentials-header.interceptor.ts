import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AttachWithCredentialsHeaderInterceptor implements HttpInterceptor {
  constructor() {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // this option will allow all http requests to have a cookie in request header
    request = request.clone({ withCredentials: true });
    return next.handle(request);
  }
}
