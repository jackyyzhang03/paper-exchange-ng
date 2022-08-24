import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailVerificationService {

  constructor(private http: HttpClient) { }

  public verifyEmail(verificationToken: string) {
    return this.http.post(`http://${environment.apiUrl}/auth/verify`,
      { verificationToken });
  }

  public resendEmail() {
    return this.http.get(
      `http://${environment.apiUrl}/auth/verification-email`);
  }
}
