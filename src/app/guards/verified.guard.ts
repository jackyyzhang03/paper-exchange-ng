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
export class VerifiedGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {};

  canActivate(
    next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = '/' + next.url.join('/');
    if (!this.authService.isVerified() && url !== '/verify') {
      this.router.navigateByUrl('/verify');
      return false;
    } else if (this.authService.isVerified() && url === '/verify') {
      this.router.navigateByUrl('');
      return false;
    }
    return true;
  }
}
