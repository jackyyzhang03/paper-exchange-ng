import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmailVerificationService {

  constructor(private http: HttpClient) { }

  public verifyEmail(verificationToken: string) {
    return this.http.post('http://localhost:8080/auth/verify',
      { verificationToken });
  }

  public resendEmail() {
    return this.http.get('http://localhost:8080/auth/verification-email');
  }
}
