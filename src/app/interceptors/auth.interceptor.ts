import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone(
        { setHeaders: { 'Authorization': `Bearer ${token}` } });
    }

    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401 && this.router.url !== '/login') {
          this.authService.logout();
        } else if (error.status === 403) {
          this.router.navigateByUrl('/verify');
          return EMPTY;
        }
      }
      return throwError(() => error);
    }));
  }
}
