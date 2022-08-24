import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {};

  canActivate(
    next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = '/' + next.url.join('/');
    const isLoginPage = url === '/login' || url === '/register';
    const isAuthenticated = this.authService.isAuthenticated();
    if (isAuthenticated && isLoginPage) {
      this.router.navigateByUrl('');
    } else if (!isAuthenticated && !isLoginPage) {
      this.authService.setRedirectUrl(url);
      this.authService.setRedirectQueryParams(next.queryParams);
      this.router.navigateByUrl('/login');
    } else {
      return true;
    }
    return false;
  }
}
