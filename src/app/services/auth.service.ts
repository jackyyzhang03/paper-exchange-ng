import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authEndpoint = 'http://localhost:8080/auth';
  private authenticated = false;

  constructor(private http: HttpClient, private router: Router) {
    if (localStorage.getItem('token')) {
      this.authenticated = true;
    }
  }

  login(
    username: string, password: string) {
    const credentials = btoa(`${username}:${password}`);
    return this.http.post(this.authEndpoint + '/login', null, {
      headers: { 'Authorization': `Basic ${credentials}` },
      responseType: 'text',
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.authenticated = false;
    this.router.navigateByUrl('/login');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.authenticated = true;
  }

  isAuthenticated() {
    return this.authenticated;
  }
}
