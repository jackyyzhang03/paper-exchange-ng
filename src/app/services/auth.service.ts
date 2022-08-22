import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Params, Router } from '@angular/router';
import { tap } from 'rxjs';

type User = {
  email: string;
  verified: boolean;
}

type UserLoginDto = {
  user: User;
  token: string;
  expiry: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authEndpoint = 'http://localhost:8080/auth';
  private authenticated = false;
  private user: User | null = null;
  private expiry: Date | null = null;
  private redirectUrl = '';
  private redirectQueryParams: Params | null = null;

  constructor(private http: HttpClient, private router: Router) {
    if (localStorage.getItem('token')) {
      this.authenticated = true;
    }
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
    }
    const expiry = localStorage.getItem('expiry');
    if (expiry) {
      this.expiry = new Date(expiry);
    }
  }

  login(
    username: string, password: string) {
    this.resetToken();
    const credentials = btoa(`${username}:${password}`);
    return this.http.post<UserLoginDto>(this.authEndpoint + '/login', null, {
      headers: { 'Authorization': `Basic ${credentials}` },
    }).pipe(tap(data => {
      this.setToken(data.token);
      this.setUser(data.user);
      this.setExpiry(new Date(data.expiry));
      this.redirect();
    }));
  }

  redirect() {
    this.router.navigate([this.redirectUrl],
      { queryParams: this.redirectQueryParams });
    this.redirectUrl = '';
    this.redirectQueryParams = null;
  }

  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  setRedirectQueryParams(params: Params) {
    this.redirectQueryParams = params;
  }

  logout() {
    this.resetToken();
    this.resetExpiry();
    this.resetUser();
    this.router.navigateByUrl('/login');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.authenticated = true;
  }

  resetToken() {
    localStorage.removeItem('token');
    this.authenticated = false;
  }

  resetExpiry() {
    localStorage.removeItem('expiry');
    this.expiry = null;
  }

  resetUser() {
    localStorage.removeItem('user');
    this.user = null;
  }

  register(email: string, password: string) {
    return this.http.post(this.authEndpoint + '/register',
      { email, password });
  }

  isAuthenticated() {
    return this.authenticated;
  }

  isVerified() {
    return !!(this.user && this.user.verified);
  }

  private setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
  }

  private setExpiry(expiry: Date) {
    localStorage.setItem('expiry', expiry.toISOString());
    this.expiry = expiry;
  }
}
