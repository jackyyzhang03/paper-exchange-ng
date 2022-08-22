import { Component, OnInit } from '@angular/core';
import {
  EmailVerificationService,
} from '../../services/email-verification.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements OnInit {
  success: boolean | null = null;

  constructor(
    private emailVerificationService: EmailVerificationService,
    private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    const verificationToken = this.route.snapshot.queryParamMap.get('token');
    if (verificationToken !== null) {
      this.emailVerificationService.verifyEmail(verificationToken).
        pipe(catchError(error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === HttpStatusCode.Conflict) {
              this.success = false;
              return EMPTY;
            }
          }
          return throwError(() => error);
        })).
        subscribe(() => {
          // TODO: Implement refresh tokens so we don't have to log out to obtain a new token
          this.success = true;
          setTimeout(() => this.authService.logout(), 2500);
        });
    }
  }

  resend() {
    this.emailVerificationService.resendEmail().subscribe();
  }
}
